/* eslint-disable consistent-return */
import SocketIO, { Socket } from "socket.io";
import { BattleRoomGame, User } from "../../../../common";
import { Lobby } from "../Lobby";
import initializeListeners from "./initializeListeners";
import { SocketIDsByUsername, SocketMetadataList } from "../../types";
import endGameAndEmitUpdates from "./endGameAndEmitUpdates";
import handleReadyStateToggleRequest from "./handleReadyStateToggleRequest";
import handleSocketLeavingGame from "./handleSocketLeavingGame";
import { MatchmakingQueue } from "../MatchmakingQueue";
// import BattleRoomRecord from "../../models/BattleRoomRecord";
import socketCheckForBannedIpAddress from "./middleware/socketCheckForBannedIpAddress";
import { ipRateLimiter } from "../../middleware/rateLimiter";
import { wrapExpressMiddlewareForSocketIO } from "../../utils/wrapExpressMiddlewareForSocketIO";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";

export class LucellaServer {
  io: SocketIO.Server;
  lobby: Lobby;
  games: { [gameName: string]: BattleRoomGame } = {};
  connectedSockets: SocketMetadataList = {};
  connectedUsers: SocketIDsByUsername = {};
  matchmakingQueue: MatchmakingQueue;
  constructor(expressServer: any) {
    this.io = new SocketIO.Server(expressServer);
    this.io.use(socketCheckForBannedIpAddress);
    this.io.use(wrapExpressMiddlewareForSocketIO(ipRateLimiter));
    this.matchmakingQueue = new MatchmakingQueue(this);
    this.lobby = new Lobby(this);
    initializeListeners(this);
    // this.rankedQueue = new RankedQueue()
  }

  async handleSocketLeavingGame(socket: Socket, isDisconnecting: boolean) {
    await handleSocketLeavingGame(this, socket, isDisconnecting);
  }
  async handleSocketDisconnection(socket: Socket) {
    if (!this.connectedSockets[socket.id]) return;
    const socketMetaLeaving = this.connectedSockets[socket.id];
    if (socketMetaLeaving.currentGameName) await this.handleSocketLeavingGame(socket, true);
    else this.lobby.changeSocketChatChannelAndEmitUpdates(socket, null, false);

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
  async endGameAndEmitUpdates(game: BattleRoomGame) {
    await endGameAndEmitUpdates(this, game);
  }
  handleReadyStateToggleRequest(socket: Socket) {
    handleReadyStateToggleRequest(this, socket);
  }
  static async fetchOrCreateBattleRoomScoreCard(user: User) {
    let scoreCard = await BattleRoomScoreCardRepo.findByUserId(user.id);
    if (!scoreCard) scoreCard = await BattleRoomScoreCardRepo.insert(user.id);
    return scoreCard;
  }
}
