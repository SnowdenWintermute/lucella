/* eslint-disable consistent-return */
import { Socket } from "socket.io";
import {
  ErrorMessages,
  maxEloDiffThreshold,
  eloDiffThresholdAdditive,
  rankedGameChannelNamePrefix,
  SocketEventsFromServer,
  OfficialChannels,
  ONE_SECOND,
  UserStatuses,
  IBattleRoomScoreCard,
} from "../../../../common";
import UserRepo from "../../database/repos/users";
import { wrappedRedis } from "../../utils/RedisContext";
import { LucellaServer } from "..";
import { lucella } from "../../lucella";

export interface MatchmakingQueueUser {
  userId: string;
  record: IBattleRoomScoreCard;
  socketId: string;
  username: string;
}

export class MatchmakingQueue {
  users: {
    [socketId: string]: MatchmakingQueueUser;
  } = {};
  matchmakingInterval: NodeJS.Timeout | null = null;
  currentEloDiffThreshold = 0;
  rankedGameCurrentNumber = 0;
  currentIntervalIteration = 0;
  eloDiffThresholdAdditive = eloDiffThresholdAdditive;
  server: LucellaServer;
  constructor(server: LucellaServer) {
    this.server = server;
  }

  async addUser(socket: Socket) {
    const user = await UserRepo.findOne("name", this.server.connectedSockets[socket.id]?.associatedUser.username);
    if (!user || user.status === UserStatuses.DELETED) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED);
    if (this.users[socket.id]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.ALREADY_IN_MATCHMAKING_QUEUE);
    const userBattleRoomRecord = await LucellaServer.fetchOrCreateBattleRoomScoreCard(user);
    this.users[socket.id] = {
      userId: user.id.toString(), // todo- investigate why this needs to be a string and not anumber
      record: userBattleRoomRecord,
      socketId: socket.id,
      username: user.name,
    };
    // refresh their session because they took an action that requires being logged in
    wrappedRedis.context!.set(user.id.toString(), JSON.stringify(user), {
      EX: parseInt(process.env.AUTH_SESSION_EXPIRATION!, 10),
    });

    socket.join(OfficialChannels.matchmakingQueue);
    socket.emit(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED);
    this.currentEloDiffThreshold = 0;
    if (!this.matchmakingInterval) this.createMatchmakingInterval();
  }
  removeUser(socketId: string) {
    delete this.users[socketId];
    if (Object.keys(this.users).length < 1) this.clearMatchmakingInterval();
  }
  clearMatchmakingInterval() {
    if (this.matchmakingInterval) clearInterval(this.matchmakingInterval);
    this.matchmakingInterval = null;
  }
  createMatchmakingInterval() {
    const { io } = this.server;
    this.currentIntervalIteration = 1;
    this.matchmakingInterval = setInterval(() => {
      this.currentIntervalIteration += 1;
      if (Object.keys(this.users).length < 1) return this.clearMatchmakingInterval();
      io.in(OfficialChannels.matchmakingQueue).emit(SocketEventsFromServer.MATCHMAKING_QUEUE_UPDATE, {
        queueSize: Object.keys(this.users).length,
        currentEloDiffThreshold: this.currentEloDiffThreshold,
      });
      const bestMatch = this.getBestMatch();
      const { players, eloDiff } = bestMatch;

      if (players === null || eloDiff === null || eloDiff >= this.currentEloDiffThreshold) {
        this.increaseEloDiffMatchingThreshold();
        return;
      }

      const hostSocket = io.sockets.sockets.get(players.host.socketId);
      const challengerSocket = io.sockets.sockets.get(players.challenger.socketId);
      if (!hostSocket || !challengerSocket) {
        if (!hostSocket) delete this.users[players.host.socketId];
        if (!challengerSocket) delete this.users[players.challenger.socketId];
        return;
      }

      this.startRankedGame(hostSocket, challengerSocket);
      this.rankedGameCurrentNumber += 1;

      Object.values(players).forEach((player) => {
        this.removeUser(player.socketId);
        if (!io.sockets.sockets.get(player.socketId)) return;
        io.sockets.sockets.get(player.socketId)!.leave(OfficialChannels.matchmakingQueue);
      });

      if (Object.keys(this.users).length < 1) this.clearMatchmakingInterval();

      bestMatch.eloDiff = null;
      bestMatch.players = null;
    }, lucella.server!.config.matchmakingQueueIntervalLength);
  }
  increaseEloDiffMatchingThreshold() {
    if (this.currentEloDiffThreshold >= maxEloDiffThreshold) return;
    const exponentiallyIncreasedThreshold = Math.round(0.35 * 1.5 ** this.currentIntervalIteration + this.eloDiffThresholdAdditive);
    this.currentEloDiffThreshold = exponentiallyIncreasedThreshold;
  }
  startRankedGame(hostSocket: Socket, challengerSocket: Socket) {
    const gameName = rankedGameChannelNamePrefix + this.rankedGameCurrentNumber;
    this.server.lobby.handleHostNewGameRequest(hostSocket, gameName, true);
    this.server.lobby.handleJoinGameRoomRequest(challengerSocket, gameName, true);
    this.server.lobby.handleReadyStateToggleRequest(hostSocket);
    this.server.lobby.handleReadyStateToggleRequest(challengerSocket);
  }
  getBestMatch() {
    const twoBestMatchedPlayersInQueue: {
      players: { host: MatchmakingQueueUser; challenger: MatchmakingQueueUser } | null;
      eloDiff: number | null;
    } = {
      players: null,
      eloDiff: null,
    };

    const usersSortedByElo = Object.keys(this.users)
      .reduce((accumulator, socketId: string) => {
        if (!this.server.io.sockets.sockets.get(socketId)) delete this.users[socketId];
        else accumulator.push(this.users[socketId]);
        return accumulator;
      }, [] as MatchmakingQueueUser[])
      .sort((a, b) => a.record.elo - b.record.elo);

    // we sorted them by elo so the closest elo matched players will be next to each other
    // just check the next player up the list and see if the difference in elo is smaller
    usersSortedByElo.forEach((user, i) => {
      const userWithHigherElo = usersSortedByElo[i + 1];
      if (!userWithHigherElo) return;
      const eloDiff = Math.abs(userWithHigherElo.record.elo - user.record.elo);

      if (!twoBestMatchedPlayersInQueue.eloDiff || eloDiff < twoBestMatchedPlayersInQueue.eloDiff) {
        twoBestMatchedPlayersInQueue.eloDiff = eloDiff;
        twoBestMatchedPlayersInQueue.players = { host: user, challenger: userWithHigherElo };
      }
    });
    return twoBestMatchedPlayersInQueue;
  }
}
