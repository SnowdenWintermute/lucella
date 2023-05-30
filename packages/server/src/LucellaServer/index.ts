/* eslint-disable consistent-return */
import SocketIO, { Socket } from "socket.io";
import {
  BattleRoomGame,
  ERROR_MESSAGES,
  gameChannelNamePrefix,
  GameRoom,
  GameStatus,
  IBattleRoomGameRecord,
  ONE_SECOND,
  PlayerRole,
  SocketEventsFromServer,
  User,
} from "../../../common";
import { Lobby } from "./Lobby";
import initializeListeners from "./initializeListeners";
import { SocketIDsByUsername, SocketMetadataList } from "../types";
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
import updateScoreCardsAndSaveGameRecord from "../battleRoomGame/endGameCleanup/updateScoreCardsAndSaveGameRecord";
import saveBattleRoomGameSettings from "../controllers/utils/saveBattleRoomGameSettings";
import UsersRepo from "../database/repos/users";
// import broadcastLatencyUpdates from "./broadcastLatencyUpdates";

export class LucellaServer {
  io: SocketIO.Server;
  games: { [gameName: string]: BattleRoomGame } = {};
  connectedSockets: SocketMetadataList = {};
  connectedUsers: SocketIDsByUsername = {};
  lobby: Lobby;
  matchmakingQueue: MatchmakingQueue;
  gameCreationWaitingList: GameCreationWaitingList;
  config = new LucellaServerConfig();
  // latencyUpdatesBroadcastInterval: number | null = null;
  constructor(expressServer: any) {
    this.io = new SocketIO.Server(expressServer);
    this.io.use(socketCheckForBannedIpAddress);
    this.io.use(wrapExpressMiddlewareForSocketIO(ipRateLimiter));
    this.lobby = new Lobby(this);
    this.matchmakingQueue = new MatchmakingQueue(this);
    this.gameCreationWaitingList = new GameCreationWaitingList(this);
    initializeListeners(this);
    // this.latencyUpdatesBroadcastInterval = setTimeout(broadcastLatencyUpdates, ONE_SECOND * 5);
  }

  handleSocketLeavingGame(socket: Socket, isDisconnecting: boolean) {
    const { currentGameName } = this.connectedSockets[socket.id];
    const usernameOfPlayerLeaving =
      this.connectedSockets[socket.id].associatedUser.username;
    // console.log(`${usernameOfPlayerLeaving} leaving game ${currentGameName}`);
    if (!currentGameName)
      return socket.emit(
        SocketEventsFromServer.ERROR_MESSAGE,
        ERROR_MESSAGES.LOBBY.CANT_LEAVE_GAME_IF_YOU_ARE_NOT_IN_ONE
      );
    const gameRoom = this.lobby.gameRooms[currentGameName];
    if (!gameRoom)
      return socket.emit(
        SocketEventsFromServer.ERROR_MESSAGE,
        ERROR_MESSAGES.LOBBY.CANT_LEAVE_GAME_THAT_DOES_NOT_EXIST
      );

    const { players } = gameRoom;
    const playerToKick =
      players.challenger &&
      players.host?.associatedUser.username === usernameOfPlayerLeaving
        ? players.challenger
        : undefined;

    if (
      gameRoom.gameStatus === GameStatus.IN_LOBBY ||
      gameRoom.gameStatus === GameStatus.COUNTING_DOWN ||
      gameRoom.gameStatus === GameStatus.IN_WAITING_LIST
    ) {
      if (gameRoom.isRanked)
        this.lobby.handleSocketLeavingRankedGameRoomInLobby(socket, gameRoom);
      else
        this.lobby.handleSocketLeavingGameRoom(
          socket,
          gameRoom,
          isDisconnecting,
          playerToKick
        );
    } else {
      const game = this.games[currentGameName];
      if (!game)
        return console.log(
          `tried to assign game ${currentGameName} winner but no game was found.`
        );
      const remainingPlayer =
        usernameOfPlayerLeaving === players!.host!.associatedUser.username
          ? PlayerRole.CHALLENGER
          : PlayerRole.HOST;
      game.winner = remainingPlayer;
      if (gameRoom.gameStatus === GameStatus.ENDING) return;
      gameRoom.winner =
        game.winner === PlayerRole.HOST
          ? players!.host!.associatedUser.username
          : players!.challenger!.associatedUser.username;
      this.endGameAndEmitUpdates(game);
    }
  }
  handleSocketDisconnection(socket: Socket) {
    if (!this.connectedSockets[socket.id]) return;
    const socketMetaLeaving = this.connectedSockets[socket.id];
    console.log(
      `user ${socketMetaLeaving.associatedUser.username} disconnecting, currentGameName: ${socketMetaLeaving.currentGameName}`
    );
    if (socketMetaLeaving.currentGameName)
      this.handleSocketLeavingGame(socket, true);
    else this.lobby.changeSocketChatChannelAndEmitUpdates(socket, null, false);
    if (this.matchmakingQueue.users[socket.id])
      this.matchmakingQueue.removeUser(socket.id);

    const userLeaving = socketMetaLeaving.associatedUser;
    const { username } = userLeaving;
    if (!userLeaving.isGuest) {
      this.connectedUsers[username] = this.connectedUsers[username].filter(
        (socketId) => socketId !== socket.id
      );
      if (this.connectedUsers[username].length < 1)
        delete this.connectedUsers[username];
    } else delete this.connectedUsers[username];

    delete this.connectedSockets[socket.id];
    console.log(`user ${username} on socket ${socket.id} disconnected`);
  }
  disconnectUser(username: string) {
    if (!this.connectedUsers[username])
      return console.log(
        "tried to disconnect a user but they weren't in the list of connected users"
      );
    const socketIdsDisconnected: string[] = [];
    this.connectedUsers[username].forEach((socketId) => {
      if (!this.io.sockets.sockets.get(socketId))
        return console.log(
          `tried to forcibly disconnect socket ${socketId} belonging to user ${username} but it wasn't connected`
        );
      this.io.sockets.sockets.get(socketId)!.disconnect();
      socketIdsDisconnected.push(socketId);
    });
    console.log(
      `forcibly disconnected user ${username} and their socket(s) ${socketIdsDisconnected.join(
        ", "
      )}`
    );
  }
  async endGameAndEmitUpdates(game: BattleRoomGame) {
    console.log("endGameAndEmitUpdates called");
    const gameRoom = this.lobby.gameRooms[game.gameName];
    if (!gameRoom)
      return console.error(
        "tried to call endGameAndEmitUpdates but no game room was found"
      );
    const gameChatChannelName = gameChannelNamePrefix + game.gameName;
    const { players } = gameRoom;

    gameRoom.gameStatus = GameStatus.ENDING;
    this.io
      .in(gameChatChannelName)
      .emit(
        SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE,
        gameRoom.gameStatus
      );
    this.io
      .in(gameChatChannelName)
      .emit(
        SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE,
        game.gameOverCountdown.current
      );
    game.clearNewRoundCountdownInterval();
    game.clearPhysicsInterval();

    const loser =
      gameRoom.winner === players.host?.associatedUser.username
        ? players.challenger?.associatedUser.username
        : players.host?.associatedUser.username;

    let gameRecord:
      | IBattleRoomGameRecord
      | { firstPlayerScore: number; secondPlayerScore: number }
      | null = {
      firstPlayerScore: game.score.host,
      secondPlayerScore: game.score.challenger,
    };

    if (!gameRoom.winner || !loser)
      console.error(
        "Tried to update game records but either winner or loser wasn't found"
      );
    else if (game.isRanked)
      gameRecord = await updateScoreCardsAndSaveGameRecord(gameRoom, game);
    this.io
      .in(gameChatChannelName)
      .emit(SocketEventsFromServer.NAME_OF_GAME_WINNER, gameRoom.winner);

    game.gameOverCountdown.current = game.gameOverCountdown.duration;
    game.intervals.endingCountdown = setInterval(() => {
      game.gameOverCountdown.current! -= 1;
      this.io
        .to(gameChatChannelName)
        .emit(
          SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE,
          game.gameOverCountdown.current
        );
      if (game.gameOverCountdown.current! >= 1) return;
      game.clearGameEndingCountdownInterval();
      this.io
        .in(gameChatChannelName)
        .emit(SocketEventsFromServer.SHOW_SCORE_SCREEN, {
          gameRoom,
          gameRecord,
        });

      Object.values(gameRoom.players).forEach((player) => {
        if (!player) return;
        this.lobby.changeSocketChatChannelAndEmitUpdates(
          this.io.sockets.sockets.get(player.socketId!)!,
          player.previousChatChannelName || null
        );
        this.lobby.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, player);
      });
      // this cleans out the names of any players that disconnected
      delete this.lobby.chatChannels[gameChatChannelName];

      delete this.lobby.gameRooms[game.gameName];
      delete this.games[game.gameName];
      this.io.sockets.emit(
        SocketEventsFromServer.GAME_ROOM_LIST_UPDATE,
        this.lobby.getSanitizedGameRooms()
      );
    }, ONE_SECOND);
  }

  async initiateGameStartCountdown(gameRoom: GameRoom) {
    const { io, lobby, games } = this;
    const gameChatChannelName = gameChannelNamePrefix + gameRoom.gameName;
    gameRoom.countdown.current = this.config.gameStartCountdownDuration;
    io.to(gameChatChannelName).emit(
      SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE,
      gameRoom.countdown.current
    );
    gameRoom.gameStatus = GameStatus.COUNTING_DOWN;
    lobby.gameRoomsExecutingGameStartCountdown[gameRoom.gameName] = gameRoom;
    io.to(gameChatChannelName).emit(
      SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE,
      gameRoom.gameStatus
    );
    gameRoom.countdownInterval = setInterval(async () => {
      if (gameRoom.countdown.current > 0) {
        gameRoom.countdown.current -= 1;
        io.to(gameChatChannelName).emit(
          SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE,
          gameRoom.countdown.current
        );
      } else {
        if (gameRoom.countdownInterval)
          clearInterval(gameRoom.countdownInterval);
        gameRoom.gameStatus = GameStatus.IN_PROGRESS;
        delete this.lobby.gameRoomsExecutingGameStartCountdown[
          gameRoom.gameName
        ];
        io.to(gameChatChannelName).emit(
          SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE,
          gameRoom.gameStatus
        );
        const { players } = gameRoom;
        if (!players.host || !players.challenger)
          return console.error(
            "tried to start a a game but one of the players was not found"
          );
        games[gameRoom.gameName] = new BattleRoomGame(
          gameRoom.gameName,
          {
            host: players.host.associatedUser.username,
            challenger: players.challenger.associatedUser.username,
          },
          !gameRoom.isRanked
            ? gameRoom.battleRoomGameConfigOptionIndices
            : undefined,
          gameRoom.isRanked
        );
        const game = games[gameRoom.gameName];
        io.to(gameChatChannelName).emit(
          SocketEventsFromServer.GAME_INITIALIZATION
        );
        game.intervals.physics = createGamePhysicsInterval(
          io,
          this,
          gameRoom.gameName
        );
        // save their configuration options if not a ranked game
        if (gameRoom.isRanked) return;
        if (gameRoom.players.host?.associatedUser.isGuest) return;
        const hostUser = await UsersRepo.findOne(
          "name",
          gameRoom.players.host?.associatedUser.username
        );
        if (!hostUser) return;
        saveBattleRoomGameSettings(
          hostUser.id,
          gameRoom.battleRoomGameConfigOptionIndices
        );
      }
    }, ONE_SECOND);
  }

  clearGameStartCountdownInterval(gameRoom: GameRoom) {
    if (gameRoom.countdownInterval) {
      delete this.lobby.gameRoomsExecutingGameStartCountdown[gameRoom.gameName];
      clearInterval(gameRoom.countdownInterval);
    }
    gameRoom.gameStatus = GameStatus.IN_LOBBY;
  }
  static async fetchOrCreateBattleRoomScoreCard(user: User) {
    let scoreCard = await BattleRoomScoreCardRepo.findByUserId(user.id);
    if (!scoreCard) scoreCard = await BattleRoomScoreCardRepo.insert(user.id);
    await wrappedRedis.context?.zAdd(REDIS_KEYS.BATTLE_ROOM_LADDER, [
      { value: user.id.toString(), score: scoreCard.elo },
    ]);
    return scoreCard;
  }
}
