import clearIntervalIfQueueEmpty from "./clearIntervalIfQueueEmpty";
import findTwoMostCloselyMatchedPlayers from "./findTwoMostCloselyMatchedPlayers";
import increaseEloDiffMatchingThreshold from "./increaseEloDiffMatchingThreshold";
import handleDisconnectionFromQueue from "./handleDisconnectionFromQueue";
import putMatchedPlayersInGame from "./putMatchedPlayersInGame";
import removeMatchedPlayersFromQueue from "./removeMatchedPlayersFromQueue";
import { Server } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";

export default function (io: Server, serverState: ServerState) {
  const { rankedQueue } = serverState;
  let currentIntervalIteration = 1;
  rankedQueue.matchmakingInterval = setInterval(() => {
    clearIntervalIfQueueEmpty(rankedQueue);
    io.in("ranked-queue").emit("serverSendsMatchmakingQueueData", {
      queueSize: Object.keys(rankedQueue.users).length,
      currentEloDiffThreshold: rankedQueue.currentEloDiffThreshold,
    });
    const bestMatch = findTwoMostCloselyMatchedPlayers(io, serverState);
    const { players, eloDiff } = bestMatch;
    if (players !== null && eloDiff !== null && eloDiff < rankedQueue.currentEloDiffThreshold) {
      if (!io.sockets.sockets[players.host.socketId] || !io.sockets.sockets[players.challenger.socketId]) {
        handleDisconnectionFromQueue(io, rankedQueue, players);
      } else {
        putMatchedPlayersInGame(io, serverState, players);
        rankedQueue.rankedGameCurrentNumber += 1;
        removeMatchedPlayersFromQueue(io, rankedQueue, players);
        if (Object.keys(rankedQueue.users).length < 1) {
          rankedQueue.matchmakingInterval && clearInterval(rankedQueue.matchmakingInterval);
          rankedQueue.matchmakingInterval = null;
        }
        bestMatch.eloDiff = null;
        bestMatch.players = null;
      }
    } else increaseEloDiffMatchingThreshold(rankedQueue, currentIntervalIteration);
    currentIntervalIteration++;
  }, 1000);
}
