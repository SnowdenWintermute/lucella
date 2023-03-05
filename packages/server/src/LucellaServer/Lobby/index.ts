/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Socket } from "socket.io";
import {
  ChatChannel,
  GameRoom,
  SocketEventsFromServer,
  SocketMetadata,
  ErrorMessages,
  PlayerRole,
  ChatMessage,
  ChatMessageStyles,
  toKebabCase,
  gameChannelNamePrefix,
  GameStatus,
  battleRoomDefaultChatChannel,
} from "../../../../common";
import { sanitizeChatChannel, sanitizeAllGameRooms, sanitizeGameRoom } from "./sanitizers";
import updateChatChannelUsernameListsAndDeleteEmptyChannels from "./updateChatChannelUsernameListsAndDeleteEmptyChannels";
import validateGameName from "./validateGameName";
import { LucellaServer } from "../../LucellaServer";
import validateChannelName from "./validateChannelName";

export class Lobby {
  chatChannels: { [name: string]: ChatChannel };
  gameRooms: { [roomName: string]: GameRoom };
  gameRoomsExecutingGameStartCountdown: { [roomName: string]: GameRoom }; // used to keep track of how many and add that to total number of games for waiting list calculations
  server: LucellaServer;
  constructor(server: LucellaServer) {
    this.chatChannels = {};
    this.gameRooms = {};
    this.gameRoomsExecutingGameStartCountdown = {};
    this.server = server;
  }
  static getSanitizedGameRoom(gameRoom: GameRoom) {
    return sanitizeGameRoom(gameRoom);
  }
  getSanitizedGameRooms() {
    return sanitizeAllGameRooms(this.gameRooms);
  }
  getSanitizedChatChannel(channelName: string) {
    return sanitizeChatChannel(this.chatChannels[channelName]);
  }
  updateChatChannelUsernameListsAndDeleteEmptyChannels(
    socketMeta: SocketMetadata,
    channelNameLeaving: string | null | undefined,
    channelNameJoining: string | null
  ) {
    updateChatChannelUsernameListsAndDeleteEmptyChannels(this.chatChannels, socketMeta, channelNameLeaving, channelNameJoining);
  }
  handleNewChatMessage(socket: Socket, data: { style: ChatMessageStyles; text: string }) {
    // @todo - check the style the user sends against a list of valid styles for that user (can sell styles)
    const { style, text } = data;
    if (!this.server.connectedSockets[socket.id]) return console.log("error sending chat message, the socket is not registered");
    if (!this.server.connectedSockets[socket.id].currentChatChannel) return console.error("error sending chat message, the socket is not in a chat channel");
    this.server.io
      .in(this.server.connectedSockets[socket.id].currentChatChannel!)
      .emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage(text, this.server.connectedSockets[socket.id].associatedUser.username, style));
  }
  changeSocketChatChannelAndEmitUpdates(socket: Socket, channelNameJoining: string | null, authorizedForGameChannel?: boolean) {
    const { io, connectedSockets } = this.server;
    if (!socket || !connectedSockets[socket.id]) return;
    if (channelNameJoining) channelNameJoining = toKebabCase(channelNameJoining);

    const channelNameLeaving = connectedSockets[socket.id].currentChatChannel;
    this.updateChatChannelUsernameListsAndDeleteEmptyChannels(connectedSockets[socket.id], channelNameLeaving, channelNameJoining);
    if (channelNameLeaving) {
      socket?.leave(channelNameLeaving);
      io.in(channelNameLeaving).emit(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, this.getSanitizedChatChannel(channelNameLeaving));
    }

    if (channelNameJoining) {
      const validationError = validateChannelName(channelNameJoining, authorizedForGameChannel);
      if (validationError) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, validationError);
      socket.join(channelNameJoining);
      io.in(channelNameJoining).emit(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, this.getSanitizedChatChannel(channelNameJoining));
      connectedSockets[socket.id].previousChatChannelName = channelNameLeaving; // used for placing user back in their last chat channel after a game ends
      connectedSockets[socket.id].currentChatChannel = channelNameJoining;
      socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage(`Welcome to ${channelNameJoining}.`, "Server", ChatMessageStyles.PRIVATE));
    }
  }
  handleHostNewGameRequest(socket: Socket, gameName: string, isRanked?: boolean) {
    gameName = gameName.toLowerCase();
    if (!this.server.connectedSockets[socket.id]) return console.log("socket no longer registered");
    if (this.server.connectedSockets[socket.id].currentGameName)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.CANT_HOST_IF_ALREADY_IN_GAME);
    const gameCreationError = this.createGameRoom(gameName, isRanked);
    if (gameCreationError) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, gameCreationError);
    console.log(`game room created: ${gameName}`);
    this.changeSocketChatChannelAndEmitUpdates(socket, this.gameRooms[gameName].chatChannel, true);
    this.putSocketInGameRoomAndEmitUpdates(socket, gameName);
  }
  handleJoinGameRoomRequest(socket: Socket, gameName: string, assignedToGameByMatchmaking?: boolean) {
    // console.log("client requesting to join game ", gameName, "current game rooms: ", this.gameRooms);
    const gameRoom = this.gameRooms[gameName];
    if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.GAME_DOES_NOT_EXIST);
    if (gameRoom.players.host && gameRoom.players.challenger) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.GAME_IS_FULL);
    if (gameRoom.isRanked && !assignedToGameByMatchmaking)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.CANT_JOIN_RANKED_GAME_IF_NOT_ASSIGNED);
    if (!this.server.connectedSockets[socket.id]) return console.log("socket no longer registered");
    if (this.server.connectedSockets[socket.id].currentGameName)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.CANT_JOIN_IF_ALREADY_IN_GAME);
    this.changeSocketChatChannelAndEmitUpdates(socket, gameRoom.chatChannel, true);
    this.putSocketInGameRoomAndEmitUpdates(socket, gameName);
  }
  handleReadyStateToggleRequest(socket: Socket) {
    const { connectedSockets, io } = this.server;
    const { currentGameName } = connectedSockets[socket.id];
    if (!currentGameName) return console.error(`${connectedSockets[socket.id].associatedUser.username} clicked ready but wasn't in a game`);
    const gameRoom = this.gameRooms[currentGameName];
    if (!gameRoom) return console.error("No such game exists");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked) return console.error("Can't unready from ranked game that is starting");
    const { players, playersReady } = gameRoom;
    const gameChatChannelName = gameChannelNamePrefix + currentGameName;
    const previousHostReadyState = playersReady.host;
    const previousChallengerReadyState = playersReady.challenger;

    if (players.host?.socketId === socket.id) playersReady.host = !playersReady.host;
    else if (players.challenger!.socketId === socket.id) playersReady.challenger = !playersReady.challenger;
    io.to(gameChatChannelName).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, playersReady);

    if (playersReady.host && playersReady.challenger) {
      if (Object.keys(this.server.games).length >= this.server.config.maxConcurrentGames) {
        console.log(`putting game ${gameRoom.gameName} in waiting list`);
        gameRoom.gameStatus = GameStatus.IN_WAITING_LIST;
        this.server.io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
        this.server.gameCreationWaitingList.addGameRoom(gameRoom.gameName);
      } else {
        console.log("starting game countdown for game: ", gameRoom.gameName);
        this.server.initiateGameStartCountdown(gameRoom);
      }
    } else {
      // handle unreadying (ranked users should already be removed from queue and have their socket left from the matchmaking info channel when their game)
      // was started. they can only unready if their game was started anyway, which starting the game would have had those effects already so we don't need to do it here.
      if (previousHostReadyState && previousChallengerReadyState) {
        this.server.gameCreationWaitingList.removeGameRoom(gameRoom.gameName);
        this.cancelGameRoomCountdownAndRemoveFromListOfGamesCountingDown(gameRoom);
        if (gameRoom.isRanked) {
          this.changeSocketChatChannelAndEmitUpdates(socket, connectedSockets[socket.id].previousChatChannelName || battleRoomDefaultChatChannel);
          this.handleSocketLeavingRankedGameRoomInLobby(socket, gameRoom);
          socket.emit(SocketEventsFromServer.REMOVED_FROM_MATCHMAKING);
        }
      }
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    }
  }
  createGameRoom(gameName: string, isRanked?: boolean) {
    if (this.gameRooms[gameName]) return ErrorMessages.LOBBY.GAME_EXISTS;
    const gameNameValidationError = validateGameName(gameName, isRanked);
    if (gameNameValidationError) return gameNameValidationError;
    this.gameRooms[gameName] = new GameRoom(gameName, isRanked);
  }
  putSocketInGameRoomAndEmitUpdates(socket: Socket, gameName: string) {
    const { io, connectedSockets } = this.server;
    const { username } = connectedSockets[socket.id].associatedUser;
    const gameRoom = this.gameRooms[gameName];
    if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE);
    if (connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.GAME_DOES_NOT_EXIST);
    if (gameRoom.players.host && gameRoom.players.challenger) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.GAME_IS_FULL);
    if (gameRoom.players.host && gameRoom.players.host.associatedUser.username === username)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.LOBBY.CANT_PLAY_AGAINST_SELF); // to prevent a logged in player from playing against themselves by opening another browser window

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
    // io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, this.getSanitizedGameRooms());
    io.in(gameRoom.chatChannel).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, Lobby.getSanitizedGameRoom(gameRoom));
    return gameRoom;
  }
  handleSocketLeavingGameRoom(socket: Socket, gameRoom: GameRoom, isDisconnecting: boolean, playerToKick?: SocketMetadata) {
    const gameChatChannelName = gameChannelNamePrefix + gameRoom.gameName;
    const { io, connectedSockets } = this.server;
    const usernameOfPlayerLeaving = connectedSockets[socket.id].associatedUser.username;
    const playerRoleLeaving = gameRoom.players.host?.associatedUser.username === usernameOfPlayerLeaving ? PlayerRole.HOST : PlayerRole.CHALLENGER;

    console.log("sending player back to previous channel: ", connectedSockets[socket.id].previousChatChannelName);
    this.changeSocketChatChannelAndEmitUpdates(socket, isDisconnecting ? null : connectedSockets[socket.id].previousChatChannelName);
    this.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, gameRoom.players[playerRoleLeaving]!);

    gameRoom.playersReady = { host: false, challenger: false };
    this.cancelGameRoomCountdownAndRemoveFromListOfGamesCountingDown(gameRoom);
    io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, Lobby.getSanitizedGameRoom(gameRoom));
    io.in(gameChatChannelName).emit(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, this.getSanitizedChatChannel(gameChatChannelName));

    if (playerToKick) {
      // below only happens if host left, then we are kicking the other player
      const removedPlayerSocket = io.sockets.sockets.get(playerToKick.socketId!)!;
      if (!removedPlayerSocket) console.log("tried to return a socket to a chat channel but no socket found");
      if (!connectedSockets[removedPlayerSocket.id]) console.log("tried to remove a socket that is no longer in our list");
      this.changeSocketChatChannelAndEmitUpdates(this.server.io.sockets.sockets.get(playerToKick.socketId!)!, playerToKick.previousChatChannelName!);
      this.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, gameRoom.players[PlayerRole.CHALLENGER]!);
      removedPlayerSocket.emit(
        SocketEventsFromServer.NEW_CHAT_MESSAGE,
        new ChatMessage(`Game ${gameRoom.gameName} closed by host.`, "Server", ChatMessageStyles.PRIVATE)
      );
    }

    if (!gameRoom.players.host) {
      delete this.gameRooms[gameRoom.gameName];
      delete this.chatChannels[gameChatChannelName];
    }
  }
  handleSocketLeavingRankedGameRoomInLobby(socket: Socket, gameRoom: GameRoom) {
    console.log(`${this.server.connectedSockets[socket.id].associatedUser.username} leaving a ranked game room`);
    const { challenger, host } = gameRoom.players;
    const playerLeaving = this.server.connectedSockets[socket.id];
    this.changeSocketChatChannelAndEmitUpdates(socket, playerLeaving.previousChatChannelName!);
    this.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, playerLeaving);

    const otherPlayer = challenger?.socketId === socket.id ? host : challenger;
    console.log(
      `${otherPlayer?.associatedUser.username} was the other player in the ranked game room, sending them back to chat channel `,
      otherPlayer?.previousChatChannelName
    );
    this.cancelGameRoomCountdownAndRemoveFromListOfGamesCountingDown(gameRoom);
    delete this.server.lobby.gameRooms[gameRoom.gameName];
    if (!otherPlayer) return;
    otherPlayer!.currentGameName = null;
    const otherPlayerSocket = this.server.io.sockets.sockets.get(otherPlayer!.socketId!);
    this.changeSocketChatChannelAndEmitUpdates(otherPlayerSocket!, otherPlayer!.previousChatChannelName);
    otherPlayerSocket?.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    this.server.connectedSockets[otherPlayer.socketId!].currentGameName = null;
    this.server.matchmakingQueue.removeUser(otherPlayer!.socketId!);
    this.server.matchmakingQueue.addUser(otherPlayerSocket!);
  }
  cancelGameRoomCountdownAndRemoveFromListOfGamesCountingDown(gameRoom: GameRoom) {
    gameRoom.cancelCountdownInterval();
    delete this.gameRoomsExecutingGameStartCountdown[gameRoom.gameName];
  }
  removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom: GameRoom, socketMeta: SocketMetadata) {
    if (!socketMeta) return console.log("Tried to remove a player from game room but player did not exist in that room");
    this.server.io.sockets.sockets.get(socketMeta.socketId!)?.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
    socketMeta.currentGameName = null;
    const playerRoleLeaving = gameRoom.players.host?.associatedUser.username === socketMeta.associatedUser.username ? PlayerRole.HOST : PlayerRole.CHALLENGER;
    gameRoom.players[playerRoleLeaving] = null;
  }
}