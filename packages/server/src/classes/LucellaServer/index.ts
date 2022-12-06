import { expressServer } from "../../express-server";
import { Server, Socket } from "socket.io";
import { BattleRoomGame, ErrorMessages, gameChannelNamePrefix, SocketEventsFromServer } from "../../../../common";
import { RankedQueue } from "../../interfaces/ServerState";
import { LobbyManager } from "../LobbyManager";
import initializeListeners from "./initializeListeners";
import changeSocketChannelAndEmitUpdates from "./changeSocketChannelAndEmitUpdates";
import { SocketMetadataList } from "../../types";
import putSocketInGameRoomAndEmitUpdates from "./putSocketInGameRoomAndEmitUpdates";

export class LucellaServer {
  io: Server;
  lobbyManager: LobbyManager;
  games: { [gameName: string]: BattleRoomGame };
  connectedSockets: SocketMetadataList;
  rankedQueue: RankedQueue;
  constructor() {
    this.io = new Server(expressServer);
    this.games = {};
    this.connectedSockets = {};
    initializeListeners(this);
    // this.rankedQueue = new RankedQueue()
  }
  handleJoinChatChannelRequest(socket: Socket, channelName: string) {
    changeSocketChannelAndEmitUpdates(this.io, this.connectedSockets, this.lobbyManager, socket, channelName, false);
  }
  handleHostNewGameRequest(socket: Socket, gameName: string) {
    gameName = gameName.toLowerCase();
    if (!socket) return new Error("client tried to host a game but their socket wasn't found");
    if (this.connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_HOST_IF_ALREADY_IN_GAME);
    this.lobbyManager.createGameRoom(socket, gameName, false);
    changeSocketChannelAndEmitUpdates(this.io, this.connectedSockets, this.lobbyManager, socket, gameChannelNamePrefix + gameName, true);
    putSocketInGameRoomAndEmitUpdates(this.io, this.lobbyManager, this.connectedSockets, socket, gameName);
  }
  handlePlayerLeavingGame() {
    const { connectedSockets, gameRooms } = serverState;
    const { currentGameName } = serverState.connectedSockets[socket.id];
    if (!currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "Trying to leave a game that doesn't exist");
    const gameName_lc = currentGameName.toLowerCase();
    const gameRoom = gameRooms[gameName_lc];
    if (!gameRoom) {
      console.log("client tried to leave a game that doesn't exist");
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "No game by that name exists");
    }
    if (!isDisconnecting && !connectedSockets[socket.id].currentGameName) return console.log("tried to leave a game when they weren't in one");

    try {
      if (gameRoom.gameStatus === GameStatus.IN_LOBBY || gameRoom.gameStatus === GameStatus.COUNTING_DOWN) {
        console.log("client leaving game setup screen");
        handleLeavingGameSetupScreen(io, socket, serverState, gameName_lc, isDisconnecting);
      } else {
        console.log("client leaving game in progress");
        endGameCleanup(io, socket, serverState, gameName_lc, isDisconnecting);
      }
      console.log("game list update sent after client left game");
      io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, sanitizeGameRoomsForClient(gameRooms));
    } catch (error) {
      console.log(error);
    }
  }
}
