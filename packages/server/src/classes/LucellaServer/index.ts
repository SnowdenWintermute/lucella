import { expressServer } from "../../express-server";
import { Server, Socket } from "socket.io";
import { BattleRoomGame, ErrorMessages, gameChannelNamePrefix, GameRoom, PlayerRole, SocketEventsFromServer, SocketMetadata } from "../../../../common";
import { RankedQueue } from "../../interfaces/ServerState";
import { Lobby } from "../Lobby";
import initializeListeners from "./initializeListeners";

import { SocketMetadataList } from "../../types";
import putSocketInGameRoomAndEmitUpdates from "./putSocketInGameRoomAndEmitUpdates";

import endGameAndEmitUpdates from "./endGameAndEmitUpdates";
import changeSocketChatChannelAndEmitUpdates from "./changeSocketChatChannelAndEmitUpdates";
import handleSocketLeavingGameRoom from "./handleSocketLeavingGameRoom";
import handleReadyStateToggleRequest from "./handleReadyStateToggleRequest";
import handleSocketLeavingGame from "./handleSocketLeavingGame";

export class LucellaServer {
  io: Server;
  lobby: Lobby;
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
    changeSocketChatChannelAndEmitUpdates(this, socket, channelName, false);
  }
  handleHostNewGameRequest(socket: Socket, gameName: string) {
    gameName = gameName.toLowerCase();
    if (this.connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_HOST_IF_ALREADY_IN_GAME);
    this.lobby.createGameRoom(socket, gameName, false);
    putSocketInGameRoomAndEmitUpdates(this, socket, gameName);
    changeSocketChatChannelAndEmitUpdates(this, socket, gameChannelNamePrefix + gameName, true);
  }
  handleJoinGameRoomRequest(socket: Socket, gameName: string) {
    if (this.connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_JOIN_IF_ALREADY_IN_GAME);
    changeSocketChatChannelAndEmitUpdates(this, socket, gameChannelNamePrefix + gameName, true);
    putSocketInGameRoomAndEmitUpdates(this, socket, gameName);
  }
  handleReadyStateToggleRequest(socket: Socket) {
    handleReadyStateToggleRequest(this, socket);
  }
  handleSocketLeavingGame(socket: Socket, isDisconnecting: boolean) {
    handleSocketLeavingGame(this, socket, isDisconnecting);
  }
  handleSocketLeavingGameRoom(socket: Socket, gameRoom: GameRoom, isDisconnecting: boolean, playerToKick?: SocketMetadata) {
    handleSocketLeavingGameRoom(this, socket, gameRoom, isDisconnecting, playerToKick);
  }
  handleSocketDisconnection(socket: Socket) {
    const { currentGameName } = this.connectedSockets[socket.id];
    if (currentGameName) this.handleSocketLeavingGame(socket, true);
    else changeSocketChatChannelAndEmitUpdates(this, socket, null, false);
    delete this.connectedSockets[socket.id];
    console.log(`${socket.id} disconnected`);
  }
  changeSocketChatChannelAndEmitUpdates(socket: Socket, channelName: string | null, authorizedForGameChannel?: boolean) {
    changeSocketChatChannelAndEmitUpdates(this, socket, channelName, authorizedForGameChannel);
  }
  removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom: GameRoom, socketMeta: SocketMetadata) {
    if (!socketMeta) return console.log("Tried to remove a player from game room but player did not exist in that room");
    this.io.sockets.sockets.get(socketMeta.socketId!)!.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    this.connectedSockets[socketMeta.socketId!].currentGameName = null;
    const playerRoleLeaving = gameRoom.players.host?.associatedUser.username === socketMeta.associatedUser.username ? PlayerRole.HOST : PlayerRole.CHALLENGER;
    gameRoom.players[playerRoleLeaving] = null;
  }
  endGameAndEmitUpdates(game: BattleRoomGame) {
    endGameAndEmitUpdates(this, game);
  }
}
