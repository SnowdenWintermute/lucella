import { Socket } from "socket.io";
import { SocketEventsFromClient, SocketEventsFromServer } from "@lucella/common";
import { LucellaServer } from "..";

export default function gameUiListeners(server: LucellaServer, socket: Socket) {
  socket.on(SocketEventsFromClient.NEW_CHAT_MESSAGE, (data) => {
    server.lobby.handleNewChatMessage(socket, data);
  });
  socket.on(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST, () => {
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, server.lobby.getSanitizedGameRooms());
  });
  socket.on(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, (channelName) => {
    server.lobby.changeSocketChatChannelAndEmitUpdates(socket, channelName, false);
  });
  socket.on(SocketEventsFromClient.HOSTS_NEW_GAME, (gameName) => {
    server.lobby.handleHostNewGameRequest(socket, gameName);
  });
  socket.on(SocketEventsFromClient.LEAVES_GAME, () => {
    server.handleSocketLeavingGame(socket, false);
  });
  socket.on(SocketEventsFromClient.JOINS_GAME, (gameName) => {
    server.lobby.handleJoinGameRoomRequest(socket, gameName);
  });
  socket.on(SocketEventsFromClient.CLICKS_READY, (gameName) => {
    server.handleReadyStateToggleRequest(socket);
  });
  socket.on(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE, () => {
    server.matchmakingQueue.addUser(socket);
  });
  socket.on(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE, () => {
    server.matchmakingQueue.removeUser(socket.id);
  });
}
