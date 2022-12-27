/* eslint-disable no-param-reassign */
import { Socket } from "socket.io";
import { Lobby } from ".";
import { ChatMessage, ChatMessageStyles, gameChannelNamePrefix, GameRoom, PlayerRole, SocketEventsFromServer, SocketMetadata } from "../../../../common";
import { LucellaServer } from "../LucellaServer";

export default function handleSocketLeavingGameRoom(
  server: LucellaServer,
  socket: Socket,
  gameRoom: GameRoom,
  isDisconnecting: boolean,
  playerToKick?: SocketMetadata
) {
  const gameChatChannelName = gameChannelNamePrefix + gameRoom.gameName;
  const { io, lobby, connectedSockets } = server;
  const usernameOfPlayerLeaving = connectedSockets[socket.id].associatedUser.username;
  const playerRoleLeaving = gameRoom.players.host?.associatedUser.username === usernameOfPlayerLeaving ? PlayerRole.HOST : PlayerRole.CHALLENGER;

  console.log("sending player back to previous channel: ", connectedSockets[socket.id].previousChatChannelName);
  lobby.changeSocketChatChannelAndEmitUpdates(socket, isDisconnecting ? null : connectedSockets[socket.id].previousChatChannelName!);
  lobby.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, gameRoom.players[playerRoleLeaving]!);

  gameRoom.playersReady = { host: false, challenger: false };
  gameRoom.cancelCountdownInterval();
  io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, Lobby.getSanitizedGameRoom(gameRoom));
  io.in(gameChatChannelName).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, lobby.getSanitizedChatChannel(gameChatChannelName));

  if (playerToKick) {
    // below only happens if host left, then we are kicking the other player
    const removedPlayerSocket = io.sockets.sockets.get(playerToKick.socketId!)!;
    if (!removedPlayerSocket) console.log("tried to return a socket to a chat channel but no socket found");
    if (!connectedSockets[removedPlayerSocket.id]) console.log("tried to remove a socket that is no longer in our list");
    lobby.changeSocketChatChannelAndEmitUpdates(server.io.sockets.sockets.get(playerToKick.socketId!)!, playerToKick.previousChatChannelName!);
    lobby.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, gameRoom.players[PlayerRole.CHALLENGER]!);
    removedPlayerSocket.emit(
      SocketEventsFromServer.NEW_CHAT_MESSAGE,
      new ChatMessage(`Game ${gameRoom.gameName} closed by host.`, "Server", ChatMessageStyles.PRIVATE)
    );
  }

  if (!gameRoom.players.host) {
    delete lobby.gameRooms[gameRoom.gameName];
    delete lobby.chatChannels[gameChatChannelName];
  }
}
