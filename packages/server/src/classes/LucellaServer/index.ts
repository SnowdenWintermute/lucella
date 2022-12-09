import { expressServer } from "../../express-server";
import { Server, Socket } from "socket.io";
import { BattleRoomGame } from "../../../../common";
import { Lobby } from "../Lobby";
import initializeListeners from "./initializeListeners";
import { SocketMetadataList } from "../../types";
import endGameAndEmitUpdates from "./endGameAndEmitUpdates";
import handleReadyStateToggleRequest from "./handleReadyStateToggleRequest";
import handleSocketLeavingGame from "./handleSocketLeavingGame";
import { MatchmakingQueue } from "../MatchmakingQueue";

export class LucellaServer {
  io: Server;
  lobby: Lobby;
  games: { [gameName: string]: BattleRoomGame };
  connectedSockets: SocketMetadataList;
  matchmakingQueue: MatchmakingQueue;
  constructor() {
    this.io = new Server(expressServer);
    this.matchmakingQueue = new MatchmakingQueue(this);
    this.lobby = new Lobby(this);
    this.games = {};
    this.connectedSockets = {};
    initializeListeners(this);
    // this.rankedQueue = new RankedQueue()
  }

  handleSocketLeavingGame(socket: Socket, isDisconnecting: boolean) {
    handleSocketLeavingGame(this, socket, isDisconnecting);
  }
  handleSocketDisconnection(socket: Socket) {
    const { currentGameName } = this.connectedSockets[socket.id];
    if (currentGameName) this.handleSocketLeavingGame(socket, true);
    else this.lobby.changeSocketChatChannelAndEmitUpdates(socket, null, false);
    delete this.connectedSockets[socket.id];
    console.log(`${socket.id} disconnected`);
  }
  endGameAndEmitUpdates(game: BattleRoomGame) {
    endGameAndEmitUpdates(this, game);
  }
  handleReadyStateToggleRequest(socket: Socket) {
    handleReadyStateToggleRequest(this, socket);
  }
}
