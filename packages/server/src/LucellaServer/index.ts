/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import SocketIO, { Socket } from "socket.io";
import { BattleRoomGame, gameChannelNamePrefix, GameRoom, GameStatus, ONE_SECOND, SocketEventsFromServer, User } from "../../../common";
import { Lobby } from "./Lobby";
import initializeListeners from "./initializeListeners";
import { SocketIDsByUsername, SocketMetadataList } from "../types";
import endGameAndEmitUpdates from "./endGameAndEmitUpdates";
import handleSocketLeavingGame from "./handleSocketLeavingGame";
import { MatchmakingQueue } from "./MatchmakingQueue";
import socketCheckForBannedIpAddress from "./middleware/socketCheckForBannedIpAddress";
import { ipRateLimiter } from "../middleware/rateLimiter";
import { wrapExpressMiddlewareForSocketIO } from "../utils/wrapExpressMiddlewareForSocketIO";
import BattleRoomScoreCardRepo from "../database/repos/battle-room-game/score-cards";
import { wrappedRedis } from "../utils/RedisContext";
import { REDIS_KEYS } from "../consts";
import { GameCreationWaitingList } from "./GameCreationWaitingList";
import createGamePhysicsInterval from "../battleRoomGame/createGamePhysicsInterval";
import LucellaServerConfig from "./LucellaServerConfig";

export class LucellaServer {
  io: SocketIO.Server;
  games: { [gameName: string]: BattleRoomGame } = {};
  connectedSockets: SocketMetadataList = {};
  connectedUsers: SocketIDsByUsername = {};
  lobby: Lobby;
  matchmakingQueue: MatchmakingQueue;
  gameCreationWaitingList: GameCreationWaitingList;
  config = new LucellaServerConfig();
  constructor(expressServer: any) {
    this.io = new SocketIO.Server(expressServer);
    this.io.use(socketCheckForBannedIpAddress);
    this.io.use(wrapExpressMiddlewareForSocketIO(ipRateLimiter));
    this.lobby = new Lobby(this);
    this.matchmakingQueue = new MatchmakingQueue(this);
    this.gameCreationWaitingList = new GameCreationWaitingList(this);
    initializeListeners(this);
  }

  handleSocketLeavingGame(socket: Socket, isDisconnecting: boolean) {
    handleSocketLeavingGame(this, socket, isDisconnecting);
  }
  handleSocketDisconnection(socket: Socket) {
    if (!this.connectedSockets[socket.id]) return;
    const socketMetaLeaving = this.connectedSockets[socket.id];
    console.log(`user ${socketMetaLeaving.associatedUser.username} disconnecting, currentGameName: ${socketMetaLeaving.currentGameName}`);
    if (socketMetaLeaving.currentGameName) this.handleSocketLeavingGame(socket, true);
    else this.lobby.changeSocketChatChannelAndEmitUpdates(socket, null, false);
    if (this.matchmakingQueue.users[socket.id]) this.matchmakingQueue.removeUser(socket.id);

    const userLeaving = socketMetaLeaving.associatedUser;
    const { username } = userLeaving;
    if (!userLeaving.isGuest) {
      this.connectedUsers[username] = this.connectedUsers[username].filter((socketId) => socketId !== socket.id);
      if (this.connectedUsers[username].length < 1) delete this.connectedUsers[username];
    } else delete this.connectedUsers[username];

    delete this.connectedSockets[socket.id];
    console.log(`user ${username} on socket ${socket.id} disconnected`);
  }
  disconnectUser(username: string) {
    if (!this.connectedUsers[username]) return console.log("tried to disconnect a user but they weren't in the list of connected users");
    const socketIdsDisconnected: string[] = [];
    this.connectedUsers[username].forEach((socketId) => {
      if (!this.io.sockets.sockets.get(socketId))
        return console.log(`tried to forcibly disconnect socket ${socketId} belonging to user ${username} but it wasn't connected`);
      this.io.sockets.sockets.get(socketId)!.disconnect();
      socketIdsDisconnected.push(socketId);
    });
    console.log(`forcibly disconnected user ${username} and their socket(s) ${socketIdsDisconnected.join(", ")}`);
  }
  endGameAndEmitUpdates(game: BattleRoomGame) {
    endGameAndEmitUpdates(this, game);
  }
  handleReadyStateToggleRequest(socket: Socket) {
    const { currentGameName } = this.connectedSockets[socket.id];
    if (!currentGameName) return console.error(`${this.connectedSockets[socket.id].associatedUser.username} clicked ready but wasn't in a game`);
    const gameRoom = this.lobby.gameRooms[currentGameName];
    if (!gameRoom) return console.error("No such game exists");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked) return console.error("Can't unready from ranked game");
    const { players, playersReady } = gameRoom;
    const gameChatChannelName = gameChannelNamePrefix + currentGameName;
    const previousHostReadyState = playersReady.host;
    const previousChallengerReadyState = playersReady.challenger;

    if (players.host!.uuid === this.connectedSockets[socket.id].uuid) playersReady.host = !playersReady.host;
    else if (players.challenger!.uuid === this.connectedSockets[socket.id].uuid) playersReady.challenger = !playersReady.challenger;
    this.io.to(gameChatChannelName).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, playersReady);

    if (playersReady.host && playersReady.challenger) {
      if (Object.keys(this.games).length >= this.config.maxConcurrentGames) {
        console.log(`putting game ${gameRoom.gameName} in waiting list`);
        gameRoom.gameStatus = GameStatus.IN_WAITING_LIST;
        this.io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
        this.gameCreationWaitingList.addGameRoom(gameRoom.gameName);
      } else {
        console.log("starting game countdown for game: ", gameRoom.gameName);
        this.initiateGameStartCountdown(gameRoom);
      }
    } else {
      if (previousHostReadyState && previousChallengerReadyState) this.gameCreationWaitingList.removeGameRoom(gameRoom.gameName);

      gameRoom.cancelCountdownInterval();
      this.io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
      this.io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    }
  }
  initiateGameStartCountdown(gameRoom: GameRoom) {
    const { io, games } = this;
    const gameChatChannelName = gameChannelNamePrefix + gameRoom.gameName;
    gameRoom.gameStatus = GameStatus.COUNTING_DOWN;
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    gameRoom.countdownInterval = setInterval(() => {
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
      gameRoom.countdown.current -= 1;
      if (gameRoom.countdown.current > 0) return;
      if (gameRoom.countdownInterval) clearInterval(gameRoom.countdownInterval);
      gameRoom.gameStatus = GameStatus.IN_PROGRESS;
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
      games[gameRoom.gameName] = new BattleRoomGame(gameRoom.gameName, gameRoom.isRanked);
      const game = games[gameRoom.gameName];
      io.to(gameChatChannelName).emit(SocketEventsFromServer.GAME_INITIALIZATION);
      game.intervals.physics = createGamePhysicsInterval(io, this, gameRoom.gameName);
    }, ONE_SECOND);
  }
  static async fetchOrCreateBattleRoomScoreCard(user: User) {
    let scoreCard = await BattleRoomScoreCardRepo.findByUserId(user.id);
    if (!scoreCard) scoreCard = await BattleRoomScoreCardRepo.insert(user.id);
    await wrappedRedis.context?.zAdd(REDIS_KEYS.BATTLE_ROOM_LADDER, [{ value: user.id.toString(), score: scoreCard.elo }]);
    return scoreCard;
  }
}
