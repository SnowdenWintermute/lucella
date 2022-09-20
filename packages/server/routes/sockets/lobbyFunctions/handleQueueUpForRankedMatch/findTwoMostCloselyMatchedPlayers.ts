const compareAllPlayersElo = require('./compareAllPlayersElo')

module.exports = ({ application }) => {
  const { io, rankedQueue } = application
  const bestMatch = {
    players: null,
    eloDiff: null
  }
  const { players, eloDiff } = bestMatch
  Object.keys(rankedQueue.users).forEach((nameOfPlayerInQueue) => {
    if (!io.sockets.sockets[nameOfPlayerInQueue]) return delete rankedQueue.users[nameOfPlayerInQueue];
    const currentBestMatch = compareAllPlayersElo({ application, nameOfPlayerInQueue })
    if (
      currentBestMatch.player &&
      (players === null || currentBestMatch.eloDiff < eloDiff)
    ) {
      bestMatch.eloDiff = currentBestMatch.eloDiff;
      bestMatch.players = {
        host: rankedQueue.users[nameOfPlayerInQueue],
        challenger: currentBestMatch.player,
      };
    }
  });
  return bestMatch
}