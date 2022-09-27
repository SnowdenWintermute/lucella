import { Server } from "socket.io";
import ServerState, { RankedQueueUser } from "../../../../interfaces/ServerState";
import compareAllPlayersElo from "./compareAllPlayersElo";

export default function findTwoMostCloselyMatchedPlayers(io: Server, serverState: ServerState) {
  const { rankedQueue } = serverState;
  const bestMatch: {
    players: { host: RankedQueueUser; challenger: RankedQueueUser } | null;
    eloDiff: number | null;
  } = {
    players: null,
    eloDiff: null,
  };
  const { players, eloDiff } = bestMatch;
  Object.keys(rankedQueue.users).forEach((socketId) => {
    if (!io.sockets.sockets.get(socketId)) return delete rankedQueue.users[socketId];
    const currentBestMatch = compareAllPlayersElo(io, serverState, socketId);
    if (currentBestMatch.eloDiff && eloDiff) {
      if (currentBestMatch.player && (players === null || currentBestMatch.eloDiff < eloDiff)) {
        bestMatch.eloDiff = currentBestMatch.eloDiff;
        bestMatch.players = {
          host: rankedQueue.users[socketId],
          challenger: currentBestMatch.player,
        };
      }
    }
  });

  return bestMatch;
}
