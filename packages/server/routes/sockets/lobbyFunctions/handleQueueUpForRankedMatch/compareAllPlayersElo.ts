module.exports = ({ application, nameOfPlayerInQueue }) => {
  const { io, connectedSockets, rankedQueue } = application
  const currentBestMatch = {
    player: null,
    eloDiff: null,
  }
  const { player, eloDiff } = currentBestMatch
  const currPlayerElo = rankedQueue.users[nameOfPlayerInQueue].record.elo;
  Object.keys(rankedQueue.users).forEach((nameOfPlayerToCompare) => {
    if (!io.sockets.sockets[nameOfPlayerToCompare]) return delete rankedQueue.users[nameOfPlayerToCompare];
    if (
      nameOfPlayerToCompare === nameOfPlayerInQueue &&
      connectedSockets[nameOfPlayerInQueue].username ===
      connectedSockets[nameOfPlayerToCompare].username
    ) return

    const playerToCompare = rankedQueue.users[nameOfPlayerToCompare]
    const comparedPlayerElo = playerToCompare
      .record
      ? playerToCompare.record.elo
      : 1500;
    const currEloDiff = Math.abs(currPlayerElo - comparedPlayerElo);
    if (
      player === null ||
      eloDiff > currEloDiff
    ) {
      currentBestMatch.player = playerToCompare;
      currentBestMatch.eloDiff = currEloDiff;
    }
  })

  return currentBestMatch
}