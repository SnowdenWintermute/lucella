import { ChatMessage, gameChannelNamePrefix, GameRoom, PlayerRole, SocketEventsFromServer, SocketMetadata, theVoid } from "@lucella/common";
import { Socket } from "socket.io";
import { LucellaServer } from ".";

export default function handleSocketLeavingGameRoom(
  lucellaServer: LucellaServer,
  socket: Socket,
  gameRoom: GameRoom,
  isDisconnecting: boolean,
  playerToKick?: SocketMetadata
) {
  const gameChatChannelName = gameChannelNamePrefix + gameRoom.gameName;
  const { io, lobby, connectedSockets } = lucellaServer;
  const usernameOfPlayerLeaving = connectedSockets[socket.id].associatedUser.username;
  const playerRoleLeaving = gameRoom.players.host?.associatedUser.username === usernameOfPlayerLeaving ? PlayerRole.HOST : PlayerRole.CHALLENGER;

  lucellaServer.changeSocketChatChannelAndEmitUpdates(socket, isDisconnecting ? null : connectedSockets[socket.id].previousChatChannelName!);
  lucellaServer.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, gameRoom.players[playerRoleLeaving]!);

  gameRoom.playersReady = { host: false, challenger: false };
  gameRoom.cancelCountdownInterval();
  io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, lobby.getSanitizedGameRoom(gameRoom));
  io.in(gameChatChannelName).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobby.getSanitizedChatChannel(gameChatChannelName));

  if (playerToKick) {
    // below only happens if host left, then we are kicking the other player
    const removedPlayerSocket = io.sockets.sockets.get(playerToKick.socketId!)!;
    if (!removedPlayerSocket) console.log("tried to return a socket to a chat channel but no socket found");
    if (!connectedSockets[removedPlayerSocket.id]) console.log("tried to remove a socket that is no longer in our list");
    lucellaServer.changeSocketChatChannelAndEmitUpdates(lucellaServer.io.sockets.sockets.get(playerToKick.socketId!)!, playerToKick.previousChatChannelName!);
    lucellaServer.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, gameRoom.players[PlayerRole.CHALLENGER]!);

    io.to(gameChatChannelName).emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage("Server", `Game ${gameRoom.gameName} closed by host.`, "private"));
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
    io.to(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
  }

  if (!gameRoom.players.host) {
    delete lobby.gameRooms[gameRoom.gameName];
    delete lobby.chatChannels[gameChatChannelName];
  }
}
