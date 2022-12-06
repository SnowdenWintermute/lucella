import clientRequestsToJoinChatChannel from "../lobbyFunctions/clientRequestsToJoinChatChannel";
import clientHostsNewGame from "../lobbyFunctions/clientHostsNewGame";
import clientJoinsGame from "../lobbyFunctions/clientJoinsGame";
import handleReadyClick from "../lobbyFunctions/handleReadyClick";
import clientLeavesGame from "../lobbyFunctions/clientLeavesGame";
// import handleQueueUpForRankedMatch from "../lobbyFunctions/handleQueueUpForRankedMatch";
import { Socket } from "socket.io";
import { SocketEventsFromClient, SocketEventsFromServer } from "@lucella/common";
import handleQueueUpForRankedMatch from "../lobbyFunctions/handleQueueUpForRankedMatch";
import { LucellaServer } from "../../classes/LucellaServer";

export default function gameUiListeners(server: LucellaServer, socket: Socket) {
  const { lobbyManager, rankedQueue } = server;
  socket.on(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST, () => {
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, lobbyManager.getSanitizedGameRooms());
  });
  socket.on(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, (data) => {
    server.handleJoinChatChannelRequest(socket, data);
  });
  socket.on(SocketEventsFromClient.HOSTS_NEW_GAME, (gameName) => {
    server.handleHostNewGameRequest(socket, gameName);
  });
  socket.on(SocketEventsFromClient.LEAVES_GAME, (gameName) => {
    console.log(socket.id + " leaving game " + gameName);
    clientLeavesGame(io, socket, serverState);
  });
  socket.on(SocketEventsFromClient.JOINS_GAME, (gameName) => {
    clientJoinsGame(io, socket, serverState, gameName);
  });
  socket.on(SocketEventsFromClient.CLICKS_READY, (gameName) => {
    handleReadyClick(io, socket, serverState);
  });
  socket.on(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE, () => {
    handleQueueUpForRankedMatch(io, socket, serverState);
  });
  socket.on(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE, () => {
    delete rankedQueue.users[socket.id];
  });
}
