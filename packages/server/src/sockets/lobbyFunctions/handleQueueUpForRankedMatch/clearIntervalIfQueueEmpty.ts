import { RankedQueue } from "../../../interfaces/ServerState";

export default function clearIntervalIfQueueEmpty(rankedQueue: RankedQueue) {
  if (Object.keys(rankedQueue.users).length < 1) {
    rankedQueue.matchmakingInterval && clearInterval(rankedQueue.matchmakingInterval);
    rankedQueue.matchmakingInterval = null;
    return;
  }
}
