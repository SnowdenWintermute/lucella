import { startingLadderRating } from "../../../../../common/dist";
import { Server } from "socket.io";
import ServerState, { RankedQueueUser } from "../../../interfaces/ServerState";

export default function compareCurrentPlayerEloToOthersInQueue(
  io: Server,
  serverState: ServerState,
  socketIdOfPlayerInQueue: string
) {
  const { connectedSockets, rankedQueue } = serverState;
  const currentBestMatch: { player: null | RankedQueueUser; eloDiff: null | number } = {
    player: null,
    eloDiff: null,
  };
  const currPlayerElo = rankedQueue.users[socketIdOfPlayerInQueue].record.elo;
  console.log("currPlayerElo: ", currPlayerElo);
  Object.keys(rankedQueue.users).forEach((socketIdOfUserToCompare) => {
    if (!io.sockets.sockets.get(socketIdOfUserToCompare)) return delete rankedQueue.users[socketIdOfUserToCompare];
    if (
      socketIdOfUserToCompare === socketIdOfPlayerInQueue &&
      connectedSockets[socketIdOfPlayerInQueue].associatedUser.username ===
        connectedSockets[socketIdOfUserToCompare].associatedUser.username
    )
      return;

    const playerToCompare = rankedQueue.users[socketIdOfUserToCompare];
    console.log("playerToCompare's elo: ", playerToCompare.record.elo);
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
