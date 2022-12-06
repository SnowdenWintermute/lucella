import clientRequestsToJoinChatChannel from "../lobbyFunctions/clientRequestsToJoinChatChannel";
import clientHostsNewGame from "../lobbyFunctions/clientHostsNewGame";
import clientJoinsGame from "../lobbyFunctions/clientJoinsGame";
import handleReadyClick from "../lobbyFunctions/handleReadyClick";
import clientLeavesGame from "../lobbyFunctions/clientLeavesGame";
// import handleQueueUpForRankedMatch from "../lobbyFunctions/handleQueueUpForRankedMatch";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import { SocketEventsFromClient, SocketEventsFromServer } from "../../../../common";
import handleQueueUpForRankedMatch from "../lobbyFunctions/handleQueueUpForRankedMatch";
import sanitizeGameRoomsForClient from "../../utils/sanitizeGameRoomsForClient";

export default function gameUiListeners(io: Server, socket: Socket, serverState: ServerState) {
  const { gameRooms, rankedQueue } = serverState;
  socket.on(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST, () => {
    socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, sanitizeGameRoomsForClient(gameRooms));
  });
  socket.on(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, (data) => {
    console.log("chat channel request to join data: ", data);
    if (!data) return; // todo - error handling
    clientRequestsToJoinChatChannel(io, socket, serverState, data);
  });
  socket.on(SocketEventsFromClient.HOSTS_NEW_GAME, (gameName) => {
    clientHostsNewGame(io, socket, serverState, gameName, false);
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
