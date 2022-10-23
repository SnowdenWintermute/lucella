import { Server } from "socket.io";
import ServerState, { RankedQueueUser } from "../../../interfaces/ServerState";
import compareCurrentPlayerEloToOthersInQueue from "./compareCurrentPlayerEloToOthersInQueue";

export default function findTwoMostCloselyMatchedPlayers(io: Server, serverState: ServerState) {
  const { rankedQueue } = serverState;
  const twoBestMatchedPlayersInQueue: {
    players: { host: RankedQueueUser; challenger: RankedQueueUser } | null;
    eloDiff: number | null;
  } = {
    players: null,
    eloDiff: null,
  };
  const { players, eloDiff } = twoBestMatchedPlayersInQueue;
  Object.keys(rankedQueue.users).forEach((socketId) => {
    if (!io.sockets.sockets.get(socketId)) return delete rankedQueue.users[socketId];
    const currentBestMatch = compareCurrentPlayerEloToOthersInQueue(io, serverState, socketId);
    if ((currentBestMatch.eloDiff !== 0 && !currentBestMatch.eloDiff) || !currentBestMatch.player) return;
    if (players === null || (eloDiff && currentBestMatch.eloDiff < eloDiff)) {
      twoBestMatchedPlayersInQueue.eloDiff = currentBestMatch.eloDiff;
      twoBestMatchedPlayersInQueue.players = {
        host: rankedQueue.users[socketId],
        challenger: currentBestMatch.player,
      };
    }
  });
  return twoBestMatchedPlayersInQueue;
}
