/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

import { Socket } from "socket.io";
import {
  ChatChannel,
  GameRoom,
  SocketEventsFromServer,
  SocketMetadata,
  ERROR_MESSAGES,
  PlayerRole,
  ChatMessage,
  ChatMessageStyles,
  toKebabCase,
  gameChannelNamePrefix,
  GameStatus,
  chatChannelWelcomeMessage,
  BattleRoomGameConfigOptionIndicesUpdate,
  IBattleRoomConfigSettings,
  GameType,
  CSEventsFromServer,
} from "../../../../common";
import { sanitizeChatChannel, sanitizeAllGameRooms, sanitizeGameRoom } from "./sanitizers";
import updateChatChannelUsernameListsAndDeleteEmptyChannels from "./updateChatChannelUsernameListsAndDeleteEmptyChannels";
import validateGameName from "./validateGameName";
import { LucellaServer } from "../../LucellaServer";
import validateChannelName from "./validateChannelName";
import UsersRepo from "../../database/repos/users";
import BattleRoomGameSettingsRepo from "../../database/repos/battle-room-game/settings";

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
      socket.emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage(chatChannelWelcomeMessage(channelNameJoining), "Server", ChatMessageStyles.PRIVATE));
    }
  }

  async handleHostNewGameRequest(socket: Socket, gameName: string, gameType: GameType, isRanked?: boolean) {
    if (!gameName) return console.log(ERROR_MESSAGES.LOBBY.GAME_NAME.MAX_LENGTH);
    gameName = gameName.replace(/\s+/g, "-").toLowerCase();
    if (!this.server.connectedSockets[socket.id]) return console.log("socket no longer registered");
    if (this.server.connectedSockets[socket.id].currentGameName)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.CANT_HOST_IF_ALREADY_IN_GAME);
    if (gameType === GameType.BATTLE_ROOM) this.hostNewBattleRoomGameRoom(socket, gameName, isRanked);
    else if (gameType === GameType.COMBAT_SIMULATOR) this.handleCreateNewCombatSimulator(socket, gameName);
  }

  handleCreateNewCombatSimulator(socket: Socket, gameName: string) {
    const socketMeta = this.server.connectedSockets[socket.id];
    if (socketMeta.currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.CANT_JOIN_IF_ALREADY_IN_GAME);
    if (this.server.combatSimulators[gameName]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.GAME_NAME.GAME_EXISTS);
    this.server.createCombatSimulator(gameName);
    console.log(`created combat sim ${gameName}`);
    this.handleJoinCombatSimulator(socket, gameName);
  }

  handleJoinCombatSimulator(socket: Socket, gameName: string) {
    const socketMeta = this.server.connectedSockets[socket.id];
    const cs = this.server.combatSimulators[gameName];
    if (!cs) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.GAME_DOES_NOT_EXIST);
    if (socketMeta.currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.CANT_JOIN_IF_ALREADY_IN_GAME);
    // TODO - check if game is full
    cs.players[socket.id] = socketMeta;
    socketMeta.currentGameName = gameName;
    cs.addPlayerControlledEntity(socket);
    socket.emit(CSEventsFromServer.ADDED_TO_CS_SIM);
  }

  handleLeaveCombatSimulator(socket: Socket) {
    const socketMeta = this.server.connectedSockets[socket.id];
    const { currentGameName } = socketMeta;
    if (!currentGameName) return console.log("Socket tried to leave a combat simulator but didn't have a registered game name");
    const cs = this.server.combatSimulators[currentGameName];
    if (!cs) return console.log("Socket tried to leave a combat simulator that didn't exist");
    cs.removeEntity("playerControlled", socketMeta.associatedUser.username);
    delete cs.players[socket.id];
    if (Object.keys(cs.players).length < 1) {
      console.log("removing combat simulator ", cs.gameName, " because the last player left");
      this.server.combatSimulators[cs.gameName].clearPhysicsInterval();
      delete this.server.combatSimulators[cs.gameName];
    }
    socket.emit(CSEventsFromServer.REMOVED_FROM_COMBAT_SIM);
  }

  async hostNewBattleRoomGameRoom(socket: Socket, gameName: string, isRanked?: boolean) {
    // load their config if not guest and not ranked
    let options;
    if (!isRanked) {
      const player = this.server.connectedSockets[socket.id].associatedUser;
      if (!player.isGuest) {
        const user = await UsersRepo.findOne("name", player.username);
        options = await BattleRoomGameSettingsRepo.findByUserId(user.id);
      }
    }
    const gameCreationError = this.createGameRoom(gameName, isRanked, options);
    if (gameCreationError) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, gameCreationError);
    console.log(`game room created: ${gameName}`);
    this.changeSocketChatChannelAndEmitUpdates(socket, this.gameRooms[gameName].chatChannel, true);
    this.putSocketInGameRoomAndEmitUpdates(socket, gameName);
  }

  handleJoinGameRoomRequest(socket: Socket, gameName: string, assignedToGameByMatchmaking?: boolean) {
    // console.log("client requesting to join game ", gameName, "current game rooms: ", this.gameRooms);
    const gameRoom = this.gameRooms[gameName];
    if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.GAME_DOES_NOT_EXIST);
    if (gameRoom.players.host && gameRoom.players.challenger) {
      socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, this.getSanitizedGameRooms());
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.GAME_IS_FULL);
    }
    if (gameRoom.isRanked && !assignedToGameByMatchmaking)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.CANT_JOIN_RANKED_GAME_IF_NOT_ASSIGNED);
    if (!this.server.connectedSockets[socket.id]) return console.log("socket no longer registered");
    if (this.server.connectedSockets[socket.id].currentGameName)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.CANT_JOIN_IF_ALREADY_IN_GAME);
    this.changeSocketChatChannelAndEmitUpdates(socket, gameRoom.chatChannel, true);
    this.putSocketInGameRoomAndEmitUpdates(socket, gameName);
  }

  handleEditGameRoomConfigRequest(socket: Socket, newConfig: BattleRoomGameConfigOptionIndicesUpdate) {
    const { connectedSockets, io } = this.server;
    const { currentGameName } = connectedSockets[socket.id];
    if (!currentGameName) return console.log(`${connectedSockets[socket.id].associatedUser.username} tried to edit game room config but wasn't in a game`);
    const gameRoom = this.gameRooms[currentGameName];
    if (!gameRoom) return console.log("No such game exists");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN || gameRoom.gameStatus === GameStatus.IN_WAITING_LIST)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.CANT_EDIT_GAME_CONFIG_IF_BOTH_PLAYERS_READY);
    if (GameRoom.gameScreenActive(gameRoom)) return console.log("client tried to edit game room config from a game but it had already started");
    if (gameRoom.isRanked) return console.log("Can't edit game room config from ranked game");
    if (gameRoom.players.host?.associatedUser.username !== connectedSockets[socket.id].associatedUser.username)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.ONLY_HOST_MAY_EDIT_GAME_CONFIG);
    Object.entries(newConfig).forEach(([key, value]) => {
      // @ts-ignore
      gameRoom.battleRoomGameConfigOptionIndices[key] = value;
    });
    const gameChatChannelName = gameChannelNamePrefix + currentGameName;
    io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_CONFIG, newConfig);
    // unready users
    const { playersReady } = gameRoom;
    // @ts-ignore
    Object.keys(playersReady).forEach((key) => (playersReady[key] = false));
    io.to(gameChatChannelName).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, playersReady);
  }

  handleReadyStateToggleRequest(socket: Socket) {
    const { connectedSockets, io } = this.server;
    const { currentGameName } = connectedSockets[socket.id];
    if (!currentGameName) return console.log(`${connectedSockets[socket.id].associatedUser.username} clicked ready but wasn't in a game`);
    const gameRoom = this.gameRooms[currentGameName];
    if (!gameRoom) return console.log("No such game exists");
    if (GameRoom.gameScreenActive(gameRoom)) return console.log("client tried to unready from a game but it had already started");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked) return console.log("Can't unready from ranked game that is starting");
    const { players, playersReady } = gameRoom;
    const gameChatChannelName = gameChannelNamePrefix + currentGameName;
    const previousHostReadyState = playersReady.host;
    const previousChallengerReadyState = playersReady.challenger;

    if (players.host?.socketId === socket.id) playersReady.host = !playersReady.host;
    else if (players.challenger!.socketId === socket.id) playersReady.challenger = !playersReady.challenger;
    io.to(gameChatChannelName).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, playersReady);

    if (playersReady.host && playersReady.challenger) {
      if (Object.keys(this.server.games).length + Object.keys(this.gameRoomsExecutingGameStartCountdown).length >= this.server.config.maxConcurrentGames) {
        console.log(`putting game ${gameRoom.gameName} in waiting list`);
        gameRoom.gameStatus = GameStatus.IN_WAITING_LIST;
        io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
        this.server.gameCreationWaitingList.addGameRoom(gameRoom.gameName);
      } else {
        console.log("starting game countdown for game: ", gameRoom.gameName);
        this.server.initiateGameStartCountdown(gameRoom);
      }
    } else {
      // handle unreadying. ranked users should already be removed from queue and have their socket left from the matchmaking info channel when their game
      // was started. they can only unready if their game was started anyway, which starting the game would have had those effects already so we don't need to do it here.
      if (previousHostReadyState && previousChallengerReadyState) {
        this.server.gameCreationWaitingList.removeGameRoom(gameRoom.gameName);
        this.server.clearGameStartCountdownInterval(gameRoom);
        if (gameRoom.isRanked) {
          this.handleSocketLeavingRankedGameRoomInLobby(socket, gameRoom);
          socket.emit(SocketEventsFromServer.REMOVED_FROM_MATCHMAKING);
        }
      }
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
      io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    }
  }

  createGameRoom(gameName: string, isRanked?: boolean, options?: IBattleRoomConfigSettings | undefined) {
    if (this.gameRooms[gameName]) return ERROR_MESSAGES.LOBBY.GAME_NAME.GAME_EXISTS;
    const gameNameValidationError = validateGameName(gameName, isRanked);
    if (gameNameValidationError) return gameNameValidationError;
    this.gameRooms[gameName] = new GameRoom(gameName, isRanked, options);
  }

  putSocketInGameRoomAndEmitUpdates(socket: Socket, gameName: string) {
    const { io, connectedSockets } = this.server;
    const { username } = connectedSockets[socket.id].associatedUser;
    const gameRoom = this.gameRooms[gameName];
    if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "Tried to put player in game room but it didn't exist");
    if (connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.GAME_DOES_NOT_EXIST);
    if (gameRoom.players.host && gameRoom.players.challenger) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.GAME_IS_FULL);
    if (gameRoom.players.host && gameRoom.players.host.associatedUser.username === username)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ERROR_MESSAGES.LOBBY.CANT_PLAY_AGAINST_SELF); // to prevent a logged in player from playing against themselves by opening another browser window

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
    io.in(gameRoom.chatChannel).emit(SocketEventsFromServer.CURRENT_GAME_ROOM, Lobby.getSanitizedGameRoom(gameRoom));
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
    this.server.clearGameStartCountdownInterval(gameRoom);
    io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_ROOM, Lobby.getSanitizedGameRoom(gameRoom));
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
        new ChatMessage(ERROR_MESSAGES.LOBBY.GAME_CLOSED_BY_HOST(gameRoom.gameName), "Server", ChatMessageStyles.PRIVATE)
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
    this.server.clearGameStartCountdownInterval(gameRoom);
    delete this.server.lobby.gameRooms[gameRoom.gameName];
    if (!otherPlayer) return;
    otherPlayer!.currentGameName = null;
    const otherPlayerSocket = this.server.io.sockets.sockets.get(otherPlayer!.socketId!);
    this.changeSocketChatChannelAndEmitUpdates(otherPlayerSocket!, otherPlayer!.previousChatChannelName);
    otherPlayerSocket?.emit(SocketEventsFromServer.CURRENT_GAME_ROOM, null);
    this.server.connectedSockets[otherPlayer.socketId!].currentGameName = null;
    this.server.matchmakingQueue.removeUser(otherPlayer!.socketId!);
    this.server.matchmakingQueue.addUser(otherPlayerSocket!);
  }
  removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom: GameRoom, socketMeta: SocketMetadata) {
    if (!socketMeta) return console.log("Tried to remove a player from game room but player did not exist in that room");
    this.server.io.sockets.sockets.get(socketMeta.socketId!)?.emit(SocketEventsFromServer.CURRENT_GAME_ROOM, null);
    socketMeta.currentGameName = null;
    const playerRoleLeaving = gameRoom.players.host?.associatedUser.username === socketMeta.associatedUser.username ? PlayerRole.HOST : PlayerRole.CHALLENGER;
    gameRoom.players[playerRoleLeaving] = null;
  }
}
