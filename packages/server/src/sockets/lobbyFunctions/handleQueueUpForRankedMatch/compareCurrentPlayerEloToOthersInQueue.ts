import { startingLadderRating } from "../../../../../common/dist";
import { Server } from "socket.io";
import ServerState, { RankedQueueUser } from "../../../interfaces/ServerState";

export default function compareCurrentPlayerEloToOthersInQueue(
  io: Server,
  serverState: ServerState,
  socketIdOfPlayerInQueue: string
) {
  const { rankedQueue } = serverState;
  const currentBestMatch: { player: null | RankedQueueUser; eloDiff: null | number } = {
    player: null,
    eloDiff: null,
  };
  const currPlayerElo = rankedQueue.users[socketIdOfPlayerInQueue].record.elo;
  Object.keys(rankedQueue.users).forEach((socketIdOfUserToCompare) => {
    if (!io.sockets.sockets.get(socketIdOfUserToCompare)) return delete rankedQueue.users[socketIdOfUserToCompare];
    if (socketIdOfUserToCompare === socketIdOfPlayerInQueue) return;

    const playerToCompare = rankedQueue.users[socketIdOfUserToCompare];
    const comparedPlayerElo = playerToCompare.record ? playerToCompare.record.elo : startingLadderRating;
    const currEloDiff = Math.abs(currPlayerElo - comparedPlayerElo);
    if (
      currentBestMatch.player === null ||
      currentBestMatch.eloDiff === null ||
      currentBestMatch.eloDiff > currEloDiff
    ) {
      currentBestMatch.player = playerToCompare;
      currentBestMatch.eloDiff = currEloDiff;
    }
  });

  return currentBestMatch;
}
