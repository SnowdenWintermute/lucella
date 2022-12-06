import { expressServer } from "../../express-server";
import { Server } from "socket.io";
import { BattleRoomGame, SocketMetadata } from "../../../../common";
import { RankedQueue } from "../../interfaces/ServerState";
import { LobbyManager } from "../LobbyManager";

export class GameServer {
  io: Server;
  lobbyManager: LobbyManager;
  games: { [gameName: string]: BattleRoomGame };
  connectedSockets: {
    [socketId: string]: SocketMetadata;
  };
  rankedQueue: RankedQueue;
  constructor() {
    this.io = new Server(expressServer);
    this.games = {};
    this.connectedSockets = {};
    // this.rankedQueue = new RankedQueue()
  }
}
