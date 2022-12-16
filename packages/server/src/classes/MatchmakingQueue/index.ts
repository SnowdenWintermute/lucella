import {
  ErrorMessages,
  maxEloDiffThreshold,
  eloDiffThresholdDebuggerAdditive,
  rankedGameChannelNamePrefix,
  SocketEventsFromServer,
  OfficialChannels,
} from "../../../../common";
import { Socket } from "socket.io";
import { IBattleRoomRecord } from "../../models/BattleRoomRecord";
import { findUserByField } from "../../services/user.service";
import { LucellaServer } from "../LucellaServer";

export interface MatchmakingQueueUser {
  userId: string;
  record: IBattleRoomRecord;
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
  server: LucellaServer;
  constructor(server: LucellaServer) {
    this.server = server;
  }
  async addUser(socket: Socket) {
    const user = await findUserByField("name", this.server.connectedSockets[socket.id].associatedUser.username);
    if (!user) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOG_IN_TO_PLAY_RANKED);
    let userBattleRoomRecord = await this.server.fetchOrCreateBattleRoomRecord(user);
    this.users[socket.id] = {
      userId: user.id.toString(), // todo- investigate why this needs to be a string and not anumber
      record: userBattleRoomRecord,
      socketId: socket.id,
      username: user.name,
    };
    socket.join(OfficialChannels.matchmakingQueue);
    socket.emit(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED);
    this.currentEloDiffThreshold = 0;
    if (this.matchmakingInterval) return;
    else this.createMatchmakingInterval();
  }
  removeUser(socketId: string) {
    const { io } = this.server;
    delete this.users[socketId];
  }
  clearMatchmakingInterval() {
    this.matchmakingInterval && clearInterval(this.matchmakingInterval);
    this.matchmakingInterval = null;
  }
  createMatchmakingInterval() {
    const { io } = this.server;
    this.currentIntervalIteration = 0;
    this.matchmakingInterval = setInterval(() => {
      this.currentIntervalIteration++;
      if (Object.keys(this.users).length < 1) return this.clearMatchmakingInterval();
      io.in(OfficialChannels.matchmakingQueue).emit(SocketEventsFromServer.MATCHMAKING_QUEUE_UPDATE, {
        queueSize: Object.keys(this.users).length,
        currentEloDiffThreshold: this.currentEloDiffThreshold,
      });
      const bestMatch = this.getBestMatch();
      const { players, eloDiff } = bestMatch;

      if (players === null || eloDiff === null || eloDiff >= this.currentEloDiffThreshold) return this.increaseEloDiffMatchingThreshold();

      const hostSocket = io.sockets.sockets.get(players.host.socketId);
      const challengerSocket = io.sockets.sockets.get(players.challenger.socketId);
      if (!hostSocket || !challengerSocket) {
        if (!hostSocket) delete this.users[players.host.socketId];
        if (!challengerSocket) delete this.users[players.challenger.socketId];
        return;
      }

      this.startRankedGame(hostSocket, challengerSocket);
      this.rankedGameCurrentNumber += 1;

      let playerRole: keyof typeof players;
      for (playerRole in players) {
        this.removeUser(players[playerRole].socketId);
        if (!io.sockets.sockets.get(players[playerRole].socketId)) return;
        io.sockets.sockets.get(players[playerRole].socketId)!.emit(SocketEventsFromServer.MATCH_FOUND);
        io.sockets.sockets.get(players[playerRole].socketId)!.leave(OfficialChannels.matchmakingQueue);
      }

      if (Object.keys(this.users).length < 1) {
        this.matchmakingInterval && clearInterval(this.matchmakingInterval);
        this.matchmakingInterval = null;
      }
      bestMatch.eloDiff = null;
      bestMatch.players = null;
    }, 1000);
  }
  increaseEloDiffMatchingThreshold() {
    if (this.currentEloDiffThreshold >= maxEloDiffThreshold) return;
    const exponentiallyIncreasedThreshold = Math.round(0.35 * Math.pow(1.5, this.currentIntervalIteration) + eloDiffThresholdDebuggerAdditive);
    this.currentEloDiffThreshold = exponentiallyIncreasedThreshold;
  }
  startRankedGame(hostSocket: Socket, challengerSocket: Socket) {
    const gameName = rankedGameChannelNamePrefix + this.rankedGameCurrentNumber;
    this.server.lobby.handleHostNewGameRequest(hostSocket, gameName, true);
    this.server.lobby.handleJoinGameRoomRequest(challengerSocket, gameName, true);
    this.server.handleReadyStateToggleRequest(hostSocket);
    this.server.handleReadyStateToggleRequest(challengerSocket);
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
        if (!this.server.io.sockets.sockets.get(socketId)) {
          console.log("User in matchmaking queue is no longer connected, removing them from queue.");
          delete this.users[socketId];
        } else accumulator.push(this.users[socketId]);
        return accumulator;
      }, [] as MatchmakingQueueUser[])
      .sort((a, b) => a.record.elo - b.record.elo);

    usersSortedByElo.forEach((user, i) => {
      // we sorted them by elo so the closest elo matched players will be next to each other
      const usersToCompare = [usersSortedByElo[i - 1], usersSortedByElo[i + 1]];
      usersToCompare.forEach((userToCompare) => {
        if (!userToCompare) return;
        const eloDiff = Math.abs(userToCompare.record.elo - user!.record.elo);
        if (!twoBestMatchedPlayersInQueue.eloDiff || (twoBestMatchedPlayersInQueue.eloDiff && eloDiff > twoBestMatchedPlayersInQueue.eloDiff)) {
          twoBestMatchedPlayersInQueue.eloDiff = eloDiff;
          twoBestMatchedPlayersInQueue.players = { host: user!, challenger: userToCompare };
        }
      });
    });
    return twoBestMatchedPlayersInQueue;
  }
}
