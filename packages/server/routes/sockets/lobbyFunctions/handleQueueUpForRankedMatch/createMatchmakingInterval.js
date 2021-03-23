const clientJoinsGame = require("../clientJoinsGame");
const clientHostsNewGame = require("../clientHostsNewGame");
const clientClicksReady = require("../clientClicksReady");
const clearIntervalIfQueueEmpty = require('./clearIntervalIfQueueEmpty')
const findTwoMostCloselyMatchedPlayers = require('./findTwoMostCloselyMatchedPlayers')

module.exports = ({ application }) => {
  const { io, rankedQueue } = application;
  let currentIntervalIteration = 1;
  rankedQueue.matchmakingInterval = setInterval(() => {
    clearIntervalIfQueueEmpty(rankedQueue)
    const queueSize = Object.keys(rankedQueue.users).length;
    io.in("ranked-queue").emit("serverSendsMatchmakingQueueData", {
      queueSize,
      currentEloDiffThreshold: rankedQueue.currentEloDiffThreshold,
    });
    const bestMatch = findTwoMostCloselyMatchedPlayers({ application })
    const { players, eloDiff } = bestMatch
    // check best match against threshold
    if (
      players !== null &&
      eloDiff < rankedQueue.currentEloDiffThreshold
    ) {
      // start game, remove players from queue, and stop the interval if no players are seeking
      // if either player is no longer connected, abandon this iteration of the matchmaking loop
      if (
        !io.sockets.sockets[players.host.socketId] ||
        !io.sockets.sockets[players.challenger.socketId]
      ) {
        if (!io.sockets.sockets[players.host.socketId])
          delete rankedQueue.users[
            io.sockets.sockets[players.host.socketId]
          ];
        if (!io.sockets.sockets[players.challenger.socketId])
          delete rankedQueue.users[
            io.sockets.sockets[players.challenger.socketId]
          ];
      } else {
        console.log("socket for host", io.sockets.sockets[players.host.socketId].id)
        console.log("socket for challenger", io.sockets.sockets[players.challenger.socketId].id)
        // if no one has dc'd yet, put them in a game together
        const gameName = `ranked-${rankedQueue.rankedGameCurrentNumber}`;
        clientHostsNewGame({
          application: {
            ...application,
            socket: io.sockets.sockets[players.host.socketId],
          },
          gameName,
          isRanked: true,
        })
        clientJoinsGame({
          application: {
            ...application,
            socket: io.sockets.sockets[players.challenger.socketId],
          },
          gameName,
        });
        clientClicksReady({
          application: {
            ...application,
            socket: io.sockets.sockets[players.host.socketId],
          },
          gameName,
        });
        clientClicksReady({
          application: {
            ...application,
            socket: io.sockets.sockets[players.challenger.socketId],
          },
          gameName,
        });
        rankedQueue.rankedGameCurrentNumber += 1;
        // remove matched players from queue
        delete rankedQueue.users[players.host.socketId];
        delete rankedQueue.users[players.challenger.socketId];
        io.sockets.sockets[players.host.socketId].emit("matchFound");
        io.sockets.sockets[players.challenger.socketId].emit("matchFound");
        io.sockets.sockets[players.host.socketId].leave("ranked-queue");
        io.sockets.sockets[players.challenger.socketId].leave(
          "ranked-queue"
        );
        if (Object.keys(rankedQueue.users).length < 1)
          clearInterval(rankedQueue.matchmakingInterval);
        delete rankedQueue.matchmakingInterval;
        bestMatch.eloDiff = null;
        bestMatch.players = null;
      }
    } else {
      // increase threshold
      if (rankedQueue.currentEloDiffThreshold < 3000) {
        const newEloThreshold = Math.round(
          0.35 * Math.pow(1.5, currentIntervalIteration) + 100
        );

        rankedQueue.currentEloDiffThreshold = newEloThreshold;
      }
    }
    currentIntervalIteration++;
  }, 1000);
}