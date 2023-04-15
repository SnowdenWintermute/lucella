import { Socket } from "socket.io";
import { chatMessageMaxLength, GENERIC_SOCKET_EVENTS, SocketEventsFromClient, SocketEventsFromServer } from "../../../../common";
import { LucellaServer } from "..";

export default function gameUiListeners(server: LucellaServer, socket: Socket) {
  socket.on(GENERIC_SOCKET_EVENTS.PING, (latencyOfLastPing) => {
    if (server.connectedSockets[socket.id]) server.connectedSockets[socket.id].latency = latencyOfLastPing;
    socket.emit(GENERIC_SOCKET_EVENTS.PONG);
  });
  socket.on(SocketEventsFromClient.NEW_CHAT_MESSAGE, (data) => {
    if (data.text > chatMessageMaxLength) return console.log(`${socket.id} attempted to send a message longer than the allowable length`);
    server.lobby.handleNewChatMessage(socket, data);
  });
  socket.on(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST, () => {
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, server.lobby.getSanitizedGameRooms());
  });
  socket.on(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, (channelName) => {
    server.lobby.changeSocketChatChannelAndEmitUpdates(socket, channelName, false);
  });
  socket.on(SocketEventsFromClient.HOSTS_NEW_GAME, (gameName) => {
    server.lobby.handleHostNewGameRequest(socket, gameName, false);
  });
  socket.on(SocketEventsFromClient.LEAVES_GAME, () => {
    server.handleSocketLeavingGame(socket, false);
  });
  socket.on(SocketEventsFromClient.JOINS_GAME, (gameName) => {
    server.lobby.handleJoinGameRoomRequest(socket, gameName);
  });
  socket.on(SocketEventsFromClient.CLICKS_READY, () => {
    server.lobby.handleReadyStateToggleRequest(socket);
  });
  socket.on(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE, () => {
    console.log(`${server.connectedSockets[socket.id].associatedUser.username} requested to join matchmaking queue`);
    server.matchmakingQueue.addUser(socket);
  });
  socket.on(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE, () => {
    server.matchmakingQueue.removeUser(socket.id);
  });
}
