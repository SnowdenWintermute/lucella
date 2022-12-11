import { Socket } from "socket.io";
import {
  ChatChannel,
  GameRoom,
  SocketEventsFromServer,
  SocketMetadata,
  ErrorMessages,
  PlayerRole,
  gameChannelNamePrefix,
  rankedGameChannelNamePrefix,
  ChatMessage,
  ChatMessageStyles,
} from "../../../../common";
import { sanitizeChatChannel, sanitizeAllGameRooms, sanitizeGameRoom } from "./sanitizers";
import updateChatChannelUsernameLists from "./updateChatChannelUsernameLists";
import validateGameName from "./validateGameName";
import { LucellaServer } from "../LucellaServer";
import handleSocketLeavingGameRoom from "./handleSocketLeavingGameRoom";
import validateChannelName from "./validateChannelName";

export class Lobby {
  chatChannels: { [name: string]: ChatChannel };
  gameRooms: { [roomName: string]: GameRoom };
  server: LucellaServer;
  constructor(server: LucellaServer) {
    this.chatChannels = {};
    this.gameRooms = {};
    this.server = server;
  }
  getSanitizedGameRoom(gameRoom: GameRoom) {
    return sanitizeGameRoom(gameRoom);
  }
  getSanitizedGameRooms() {
    return sanitizeAllGameRooms(this.gameRooms);
  }
  getSanitizedChatChannel(channelName: string) {
    return sanitizeChatChannel(this.chatChannels[channelName]);
  }
  updateChatChannelUsernameLists(socketMeta: SocketMetadata, channelNameLeaving: string | null, channelNameJoining: string | null) {
    updateChatChannelUsernameLists(this.chatChannels, socketMeta, channelNameLeaving, channelNameJoining);
  }
  handleNewChatMessage(socket: Socket, data: { style: string; text: string }) {
    // @todo - check the style the user sends against a list of valid styles for that user (can sell styles)
    const { style, text } = data;
    if (!this.server.connectedSockets[socket.id].currentChatChannel) return console.error("error sending chat message, the socket is not in a chat channel");
    this.server.io
      .in(this.server.connectedSockets[socket.id].currentChatChannel!)
      .emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage(this.server.connectedSockets[socket.id].associatedUser.username, text, style));
  }
  changeSocketChatChannelAndEmitUpdates(socket: Socket, channelNameJoining: string | null, authorizedForGameChannel?: boolean) {
    const { io, connectedSockets } = this.server;
    if (!socket || !connectedSockets[socket.id]) return console.error("error handling change chat channel request - no socket registered with server");
    if (channelNameJoining) channelNameJoining = channelNameJoining.toLowerCase();

    const channelNameLeaving = connectedSockets[socket.id].currentChatChannel;
    this.updateChatChannelUsernameLists(connectedSockets[socket.id], channelNameLeaving, channelNameJoining);
    if (channelNameLeaving) {
      socket?.leave(channelNameLeaving);
      io.in(channelNameLeaving).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, this.getSanitizedChatChannel(channelNameLeaving));
    }

    if (channelNameJoining) {
      const validationError = validateChannelName(channelNameJoining);
      if (validationError) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, validationError);
      socket.join(channelNameJoining);
      io.in(channelNameJoining).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, this.getSanitizedChatChannel(channelNameJoining));
      connectedSockets[socket.id].previousChatChannelName = channelNameLeaving; // used for placing user back in their last chat channel after a game ends
      connectedSockets[socket.id].currentChatChannel = channelNameJoining;
      socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage("Server", `Welcome to ${channelNameJoining}.`, ChatMessageStyles.PRIVATE));
    }
  }
  handleHostNewGameRequest(socket: Socket, gameName: string, isRanked?: boolean) {
    gameName = gameName.toLowerCase();
    if (this.server.connectedSockets[socket.id].currentGameName)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_HOST_IF_ALREADY_IN_GAME);
    const gameCreationError = this.createGameRoom(socket, gameName, isRanked);
    if (gameCreationError) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, gameCreationError);
    console.log(`game room created: ${gameName}`);
    this.changeSocketChatChannelAndEmitUpdates(socket, gameChannelNamePrefix + gameName, true);
    this.putSocketInGameRoomAndEmitUpdates(socket, gameName);
  }
  handleJoinGameRoomRequest(socket: Socket, gameName: string, assignedToGameByMatchmaking?: boolean) {
    if (!this.gameRooms[gameName]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.GAME_DOES_NOT_EXIST);
    if (this.gameRooms[gameName].isRanked && !assignedToGameByMatchmaking)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_JOIN_RANKED_GAME_IF_NOT_ASSIGNED);
    if (this.server.connectedSockets[socket.id].currentGameName)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_JOIN_IF_ALREADY_IN_GAME);
    this.changeSocketChatChannelAndEmitUpdates(socket, gameChannelNamePrefix + gameName, true);
    this.putSocketInGameRoomAndEmitUpdates(socket, gameName);
  }
  createGameRoom(socket: Socket, gameName: string, isRanked?: boolean) {
    if (this.gameRooms[gameName]) return ErrorMessages.GAME_EXISTS;
    const gameNameValidationError = validateGameName(gameName, isRanked);
    if (gameNameValidationError) return gameNameValidationError;
    this.gameRooms[gameName] = new GameRoom(gameName, isRanked);
  }
  putSocketInGameRoomAndEmitUpdates(socket: Socket, gameName: string) {
    const { io, connectedSockets } = this.server;
    const username = connectedSockets[socket.id].associatedUser.username;
    const gameRoom = this.gameRooms[gameName];
    if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE);
    if (connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.GAME_DOES_NOT_EXIST);
    if (gameRoom.players.host && gameRoom.players.challenger) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.GAME_IS_FULL);
    if (gameRoom.players.host && gameRoom.players.host.associatedUser.username === username)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.CANT_PLAY_AGAINST_SELF); // to prevent a logged in player from playing against themselves by opening another browser window

    connectedSockets[socket.id].currentGameName = gameName;
    let playerRole;
    if (!gameRoom.players.host) {
      gameRoom.players.host = connectedSockets[socket.id];
      playerRole = PlayerRole.HOST;
    } else if (!gameRoom.players.challenger) {
      gameRoom.players.challenger = connectedSockets[socket.id];
      playerRole = PlayerRole.CHALLENGER;
    }
    socket.emit(SocketEventsFromServer.PLAYER_ROLE_ASSIGNMENT, playerRole);
    io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, this.getSanitizedGameRooms());
    io.in(gameChannelNamePrefix + gameName).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, this.getSanitizedGameRoom(gameRoom));
    return gameRoom;
  }
  handleSocketLeavingGameRoom(socket: Socket, gameRoom: GameRoom, isDisconnecting: boolean, playerToKick?: SocketMetadata) {
    handleSocketLeavingGameRoom(this.server, socket, gameRoom, isDisconnecting, playerToKick);
  }
  removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom: GameRoom, socketMeta: SocketMetadata) {
    if (!socketMeta) return console.log("Tried to remove a player from game room but player did not exist in that room");
    this.server.io.sockets.sockets.get(socketMeta.socketId!)?.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    if (this.server.connectedSockets[socketMeta.socketId!]) this.server.connectedSockets[socketMeta.socketId!].currentGameName = null;
    const playerRoleLeaving = gameRoom.players.host?.associatedUser.username === socketMeta.associatedUser.username ? PlayerRole.HOST : PlayerRole.CHALLENGER;
    gameRoom.players[playerRoleLeaving] = null;
  }
}
