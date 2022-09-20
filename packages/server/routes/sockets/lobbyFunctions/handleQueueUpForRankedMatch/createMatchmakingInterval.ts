const clearIntervalIfQueueEmpty = require('./clearIntervalIfQueueEmpty')
const findTwoMostCloselyMatchedPlayers = require('./findTwoMostCloselyMatchedPlayers')
const increaseEloDiffMatchingThreshold = require('./increaseEloDiffMatchingThreshold')
const handleDisconnectionFromQueue = require('./handleDisconnectionFromQueue')
const putMatchedPlayersInGame = require('./putMatchedPlayersInGame')
const removeMatchedPlayersFromQueue = require('./removeMatchedPlayersFromQueue')

module.exports = ({ application }) => {
  const { io, rankedQueue } = application;
  let currentIntervalIteration = 1;
  rankedQueue.matchmakingInterval = setInterval(() => {
    clearIntervalIfQueueEmpty(rankedQueue)
    io.in("ranked-queue").emit("serverSendsMatchmakingQueueData", {
      queueSize: Object.keys(rankedQueue.users).length,
      currentEloDiffThreshold: rankedQueue.currentEloDiffThreshold,
    });
    const bestMatch = findTwoMostCloselyMatchedPlayers({ application })
    const { players, eloDiff } = bestMatch
    if (
      players !== null &&
      eloDiff < rankedQueue.currentEloDiffThreshold
    ) {
      if (
        !io.sockets.sockets[players.host.socketId] ||
        !io.sockets.sockets[players.challenger.socketId]
      ) {
        handleDisconnectionFromQueue({ io, rankedQueue, players })
      } else {
        putMatchedPlayersInGame({ application, players })
        rankedQueue.rankedGameCurrentNumber += 1;
        removeMatchedPlayersFromQueue({ io, rankedQueue, players })
        if (Object.keys(rankedQueue.users).length < 1) {
          clearInterval(rankedQueue.matchmakingInterval);
          delete rankedQueue.matchmakingInterval;
        }
        bestMatch.eloDiff = null;
        bestMatch.players = null;
      }
    } else increaseEloDiffMatchingThreshold(rankedQueue, currentIntervalIteration)
    currentIntervalIteration++;
  }, 1000);
}