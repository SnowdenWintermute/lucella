import { RankedQueue } from "../../../../interfaces/ServerState";

export default function increaseEloDiffMatchingThreshold(rankedQueue: RankedQueue, currentIntervalIteration: number) {
  if (rankedQueue.currentEloDiffThreshold < 3000) {
    const newEloThreshold = Math.round(0.35 * Math.pow(1.5, currentIntervalIteration) + 1000);
    rankedQueue.currentEloDiffThreshold = newEloThreshold;
  }
}
