import clientRequestsToJoinChatChannel from "../lobbyFunctions/clientRequestsToJoinChatChannel";
import clientHostsNewGame from "../lobbyFunctions/clientHostsNewGame";
import clientJoinsGame from "../lobbyFunctions/clientJoinsGame";
import handleReadyClick from "../lobbyFunctions/handleReadyClick";
import clientLeavesGame from "../lobbyFunctions/clientLeavesGame";
// import handleQueueUpForRankedMatch from "../lobbyFunctions/handleQueueUpForRankedMatch";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";

export default function gameUiListeners(io: Server, socket: Socket, serverState: ServerState) {
  const { gameRooms, rankedQueue } = serverState;
  socket.on("clientRequestsUpdateOfGameRoomList", () => {
    socket.emit("gameListUpdate", gameRooms);
  });
  socket.on("clientRequestsToJoinChatChannel", (data) => {
    clientRequestsToJoinChatChannel(io, socket, serverState, data.chatChannelToJoin.toLowerCase());
  });
  socket.on("clientHostsNewGame", ({ gameName }) => {
    clientHostsNewGame(io, socket, serverState, gameName, false);
  });
  socket.on("clientLeavesGame", (gameName) => {
    clientLeavesGame(io, socket, serverState, gameName);
  });
  socket.on("clientJoinsGame", ({ gameName }) => {
    clientJoinsGame(io, socket, serverState, gameName);
  });
  socket.on("clientClicksReady", ({ gameName }) => {
    handleReadyClick(io, socket, serverState, gameName);
  });
  socket.on("clientStartsSeekingRankedGame", async () => {
    // await handleQueueUpForRankedMatch(io, socket, serverState);
  });
  socket.on("clientCancelsMatchmakingSearch", () => {
    delete rankedQueue.users[socket.id];
  });
}
