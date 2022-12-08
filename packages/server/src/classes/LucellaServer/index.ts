import { expressServer } from "../../express-server";
import { Server, Socket } from "socket.io";
import {
  BattleRoomGame,
  ChatMessage,
  ChatMessageStyles,
  EloUpdates,
  ErrorMessages,
  gameChannelNamePrefix,
  GameRoom,
  GameStatus,
  PlayerRole,
  SocketEventsFromServer,
  SocketMetadata,
  theVoid,
} from "../../../../common";
import { RankedQueue } from "../../interfaces/ServerState";
import { LobbyManager } from "../LobbyManager";
import initializeListeners from "./initializeListeners";

import { SocketMetadataList } from "../../types";
import putSocketInGameRoomAndEmitUpdates from "./putSocketInGameRoomAndEmitUpdates";

import endGameAndEmitUpdates from "./endGameAndEmitUpdates";
import changeSocketChatChannelAndEmitUpdates from "./changeSocketChatChannelAndEmitUpdates";
import handlePlayerLeavingGame from "./handlePlayerLeavingGame";
import handleSocketLeavingGameRoom from "./handleSocketLeavingGameRoom";
import handleReadyClick from "../../sockets/lobbyFunctions/handleReadyClick";
import togglePlayerReadyState from "../../sockets/lobbyFunctions/handleReadyClick/togglePlayerReadyState";

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
    changeSocketChatChannelAndEmitUpdates(this, socket, channelName, false);
  }
  handleHostNewGameRequest(socket: Socket, gameName: string) {
    gameName = gameName.toLowerCase();
    if (this.connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_HOST_IF_ALREADY_IN_GAME);
    this.lobbyManager.createGameRoom(socket, gameName, false);
    putSocketInGameRoomAndEmitUpdates(this, socket, gameName);
    changeSocketChatChannelAndEmitUpdates(this, socket, gameChannelNamePrefix + gameName, true);
  }
  handleJoinGameRoomRequest(socket: Socket, gameName: string) {
    if (this.connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_JOIN_IF_ALREADY_IN_GAME);
    changeSocketChatChannelAndEmitUpdates(this, socket, gameChannelNamePrefix + gameName, true);
    putSocketInGameRoomAndEmitUpdates(this, socket, gameName);
  }
  handleReadyStateToggleRequest() {
    if (!socket) return console.error("client tried to ready up but their socket wasn't found");
    const { connectedSockets, gameRooms } = serverState;
    const { currentGameName } = serverState.connectedSockets[socket.id];
    if (!currentGameName) return console.error("client clicked ready but wasn't in a game");
    const gameRoom = gameRooms[currentGameName];
    const { players, playersReady } = gameRoom;
    if (!gameRoom) return console.error("No such game exists");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked) return console.error("Can't unready from ranked game");
    // togglePlayerReadyState(socket, serverState, players, playersReady);
    const { connectedSockets } = serverState;
    if (players.host!.uuid === connectedSockets[socket.id].uuid) playersReady.host = !playersReady.host;
    else if (players.challenger!.uuid === connectedSockets[socket.id].uuid) playersReady.challenger = !playersReady.challenger;
    //
    io.to(`game-${currentGameName}`).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, playersReady);
    if (playersReady.host && playersReady.challenger) startGameCountdown(io, socket, serverState, currentGameName);
    else cancelGameCountdown(io, gameRoom);
  }
  handlePlayerLeavingGame(socket: Socket, isDisconnecting: boolean) {
    handlePlayerLeavingGame(this, socket, isDisconnecting);
  }
  handleSocketLeavingGameRoom(socket: Socket, gameRoom: GameRoom, isDisconnecting: boolean, playerToKick?: SocketMetadata) {
    handleSocketLeavingGameRoom(this, socket, gameRoom, isDisconnecting, playerToKick);
  }
  handleSocketDisconnection(socket: Socket) {
    const { currentGameName } = this.connectedSockets[socket.id];
    if (currentGameName) this.handlePlayerLeavingGame(socket, true);
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
