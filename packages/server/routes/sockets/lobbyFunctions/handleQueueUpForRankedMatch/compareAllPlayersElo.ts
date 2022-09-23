import { startingLadderRating } from "@lucella/common/battleRoomGame/consts";
import { Server } from "socket.io";
import ServerState, { RankedQueueUser } from "../../../../interfaces/ServerState";

export default function (io: Server, serverState: ServerState, socketIdOfPlayerInQueue: string) {
  const { connectedSockets, rankedQueue } = serverState;
  const currentBestMatch: { player: null | RankedQueueUser; eloDiff: null | number } = {
    player: null,
    eloDiff: null,
  };
  const { player, eloDiff } = currentBestMatch;
  const currPlayerElo = rankedQueue.users[socketIdOfPlayerInQueue].record.elo;
  Object.keys(rankedQueue.users).forEach((socketIdOfUserToCompare) => {
    if (!io.sockets.sockets[socketIdOfUserToCompare]) return delete rankedQueue.users[socketIdOfUserToCompare];
    if (
      socketIdOfUserToCompare === socketIdOfPlayerInQueue &&
      connectedSockets[socketIdOfPlayerInQueue].associatedUser.username ===
        connectedSockets[socketIdOfUserToCompare].associatedUser.username
    )
      return;

    const playerToCompare = rankedQueue.users[socketIdOfUserToCompare];
    const comparedPlayerElo = playerToCompare.record ? playerToCompare.record.elo : startingLadderRating;
    const currEloDiff = Math.abs(currPlayerElo - comparedPlayerElo);
    if (player === null || eloDiff === null || eloDiff > currEloDiff) {
      currentBestMatch.player = playerToCompare;
      currentBestMatch.eloDiff = currEloDiff;
    }
  });

  return currentBestMatch;
}
