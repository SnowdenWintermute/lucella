import handleReadyClick from "../lobbyFunctions/handleReadyClick";
// import handleQueueUpForRankedMatch from "../lobbyFunctions/handleQueueUpForRankedMatch";
import { Socket } from "socket.io";
import { SocketEventsFromClient, SocketEventsFromServer } from "@lucella/common";
import handleQueueUpForRankedMatch from "../lobbyFunctions/handleQueueUpForRankedMatch";
import { LucellaServer } from "../../classes/LucellaServer";

export default function gameUiListeners(server: LucellaServer, socket: Socket) {
  const { lobby, rankedQueue } = server;
  socket.on(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST, () => {
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, lobby.getSanitizedGameRooms());
  });
  socket.on(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, (data) => {
    server.handleJoinChatChannelRequest(socket, data);
  });
  socket.on(SocketEventsFromClient.HOSTS_NEW_GAME, (gameName) => {
    server.handleHostNewGameRequest(socket, gameName);
  });
  socket.on(SocketEventsFromClient.LEAVES_GAME, () => {
    server.handleSocketLeavingGame(socket, false);
  });
  socket.on(SocketEventsFromClient.JOINS_GAME, (gameName) => {
    server.handleJoinGameRoomRequest(socket, gameName);
  });
  socket.on(SocketEventsFromClient.CLICKS_READY, (gameName) => {
    server.handleReadyStateToggleRequest(socket);
  });
  socket.on(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE, () => {
    handleQueueUpForRankedMatch(io, socket, serverState);
  });
  socket.on(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE, () => {
    delete rankedQueue.users[socket.id];
  });
}
