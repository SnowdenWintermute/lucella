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
    // check each player's elo against the others
    const currentBestMatch = compareAllPlayersElo({ application, nameOfPlayerInQueue })

    // after comparing this user to all users in queue, check if their best match is better than the overall best match
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
    // continue until all users are compared to each other

  });
  return bestMatch
}