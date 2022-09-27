export default function (rankedQueue) {
  if (Object.keys(rankedQueue.users).length < 1) {
    clearInterval(rankedQueue.matchmakingInterval);
    delete rankedQueue.matchmakingInterval;
    return;
  }
}
