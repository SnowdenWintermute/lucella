import SocketIO, { Socket } from "socket.io";
import { BattleRoomGame } from "../../../../common";
import { Lobby } from "../Lobby";
import initializeListeners from "./initializeListeners";
import { SocketIDsByUsername, SocketMetadataList } from "../../types";
import endGameAndEmitUpdates from "./endGameAndEmitUpdates";
import handleReadyStateToggleRequest from "./handleReadyStateToggleRequest";
import handleSocketLeavingGame from "./handleSocketLeavingGame";
import { MatchmakingQueue } from "../MatchmakingQueue";
import { User } from "../../models/User";
import BattleRoomRecord from "../../models/BattleRoomRecord";

export class LucellaServer {
  io: SocketIO.Server;
  lobby: Lobby;
  games: { [gameName: string]: BattleRoomGame } = {};
  connectedSockets: SocketMetadataList = {};
  connectedUsers: SocketIDsByUsername = {};
  matchmakingQueue: MatchmakingQueue;
  constructor(expressServer: any) {
    this.io = new SocketIO.Server(expressServer);
    this.matchmakingQueue = new MatchmakingQueue(this);
    this.lobby = new Lobby(this);
    initializeListeners(this);
    // this.rankedQueue = new RankedQueue()
  }

  handleSocketLeavingGame(socket: Socket, isDisconnecting: boolean) {
    handleSocketLeavingGame(this, socket, isDisconnecting);
  }
  handleSocketDisconnection(socket: Socket) {
    if (!this.connectedSockets[socket.id]) return;
    const socketMetaLeaving = this.connectedSockets[socket.id];
    if (socketMetaLeaving.currentGameName) this.handleSocketLeavingGame(socket, true);
    else this.lobby.changeSocketChatChannelAndEmitUpdates(socket, null, false);

    const userLeaving = socketMetaLeaving.associatedUser;
    const { username } = userLeaving;
    if (!userLeaving.isGuest) {
      this.connectedUsers[username] = this.connectedUsers[username].filter((socketId) => socketId !== socket.id);
      if (this.connectedUsers[username].length < 1) delete this.connectedUsers[username];
    }

    delete this.connectedSockets[socket.id];
    console.log(`user ${username} on socket ${socket.id} disconnected`);
  }
  disconnectUser(username: string) {
    if (!this.connectedUsers[username]) return console.log("tried to disconnect a user but they woren't in the list of connected users");
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
    handleReadyStateToggleRequest(this, socket);
  }
  async fetchOrCreateBattleRoomRecord(user: User) {
    let record = await BattleRoomRecord.findOne({ userId: user.id });
    if (!record) record = new BattleRoomRecord({ userId: user.id });
    await record.save();
    return record;
  }
}
