module.exports = (rankedQueue, currentIntervalIteration) => {
  if (rankedQueue.currentEloDiffThreshold < 3000) {
    const newEloThreshold = Math.round(0.35 * Math.pow(1.5, currentIntervalIteration) + 1000);
    rankedQueue.currentEloDiffThreshold = newEloThreshold;
  }
}