startGameCountdown = require("./startGameCountdown");
cancelGameCountdown = require("./cancelGameCountdown");
const User = require("../../../models/User");
const BattleRoomRecord = require("../../../models/BattleRoomRecord");
const clientJoinsGame = require("./clientJoinsGame");
const clientHostsNewGame = require("./clientHostsNewGame");

async function clientClicksRanked({
  io,
  socket,
  connectedSockets,
  gameRooms,
  chatRooms,
  gameDatas,
  gameDataIntervals,
  gameUpdatePackets,
  gameEndingIntervals,
  gameCountdownIntervals,
  defaultCountdownNumber,
  rankedQueue,
}) {
  // if user is already in game or not logged in, return error
  if (connectedSockets[socket.id].isInGame)
    return socket.emit("errorMessage", "You are already in a game");

  const user = await User.findOne({
    name: connectedSockets[socket.id].username,
  });
  if (!user)
    return socket.emit(
      "errorMessage",
      "Log in or create an account to play ranked games",
    );
  // join socket to ranked queue channel

  // put user socket in queue and reset global eloDiff threshold
  const userBattleRoomRecord = await BattleRoomRecord.findOne({
    user: user.id,
  });
  rankedQueue.users[socket.id] = {
    userId: user.id,
    record: userBattleRoomRecord,
    socketId: socket.id,
  };
  socket.join("ranked-queue");

  rankedQueue.currentEloDiffThreshold = 0;
  nextEloThresholdIncrease = 1;
  rankedGameCurrentNumber = 0;

  // if no rankedQueue interval, start one
  if (
    rankedQueue.matchmakingInterval === null ||
    !rankedQueue.matchmakingInterval
  ) {
    rankedQueue.matchmakingInterval = setInterval(() => {
      // if no players are seeking, clear the interval
      if (Object.keys(rankedQueue.users).length < 1) {
        clearInterval(rankedQueue.matchmakingInterval);
        delete rankedQueue.matchmakingInterval;
        return;
      }
      const queueSize = Object.keys(rankedQueue.users).length;
      console.log("Number of players seeking a ranked match: " + queueSize);
      io.in("ranked-queue").emit("serverSendsMatchmakingQueueSize", queueSize);
      // try to find the two players with lowest elo difference
      let bestMatch = null;
      let bestMatchEloDiff = null;
      Object.keys(rankedQueue.users).forEach((playerInQueue) => {
        // check if this socket is still connected
        if (io.sockets.sockets[playerInQueue]) {
          // check each player's elo against the others
          let lowestEloDiffPlayer = null;
          let bestEloDiffSoFar = null;
          const currPlayerElo = rankedQueue.users[playerInQueue].record.elo;
          Object.keys(rankedQueue.users).forEach((playerToCompare) => {
            // check if comparing socket is still connected
            if (io.sockets.sockets[playerToCompare]) {
              // check if the two sockets are from the same user, and don't compare two of the exact same entry in rankedQueue.users
              if (
                playerToCompare !== playerInQueue &&
                connectedSockets[playerInQueue].username !==
                  connectedSockets[playerToCompare].username
              ) {
                const comparedPlayerElo =
                  rankedQueue.users[playerToCompare].record.elo;
                const currEloDiff = Math.abs(currPlayerElo - comparedPlayerElo);
                if (
                  lowestEloDiffPlayer === null ||
                  bestEloDiffSoFar > currEloDiff
                ) {
                  console.log("Best match for current player updated");
                  lowestEloDiffPlayer = rankedQueue.users[playerToCompare];
                  bestEloDiffSoFar = currEloDiff;
                }
              }
            } else {
              console.log("Socket seeking match no longer connected");
              delete rankedQueue.users[playerToCompare];
              return;
            }
          });

          // after comparing this user to all users in queue, check if their best match is better than the overall best match
          if (
            lowestEloDiffPlayer &&
            (bestMatch === null || bestEloDiffSoFar < bestMatchEloDiff)
          ) {
            console.log("Best overall matchup updated");
            bestMatchEloDiff = bestEloDiffSoFar;
            bestMatch = {
              host: rankedQueue.users[playerInQueue],
              challenger: lowestEloDiffPlayer,
            };
          }
          // continue until all users are compared to each other
        } else {
          console.log("Socket seeking match no longer connected");
          delete rankedQueue.users[playerInQueue];
          return;
        }
      });
      console.log("bestMatchEloDiff: " + bestMatchEloDiff);
      console.log("bestMatch: ");
      console.log(bestMatch);
      // check best match against threshold
      console.log(
        "Current eloDiff threshold: " + rankedQueue.currentEloDiffThreshold,
      );
      if (
        bestMatch !== null &&
        bestMatchEloDiff < rankedQueue.currentEloDiffThreshold
      ) {
        // start game, remove players from queue, and stop the interval if no players are seeking
        // if either player is no longer connected, abandon this iteration of the matchmaking loop
        if (
          !io.sockets.sockets[bestMatch.host.socketId] ||
          !io.sockets.sockets[bestMatch.challenger.socketId]
        ) {
          if (!io.sockets.sockets[bestMatch.host.socketId])
            delete rankedQueue.users[
              io.sockets.sockets[bestMatch.host.socketId]
            ];
          if (!io.sockets.sockets[bestMatch.challenger.socketId])
            delete rankedQueue.users[
              io.sockets.sockets[bestMatch.challenger.socketId]
            ];
        } else {
          // if no one has dc'd yet, put them in a game together
          console.log(
            "game between " +
              io.sockets.sockets[bestMatch.host.socketId].id +
              "(host) and " +
              io.sockets.sockets[bestMatch.challenger.socketId].id +
              "(challenger) started",
          );
          clientHostsNewGame({
            io,
            socket: io.sockets.sockets[bestMatch.host.socketId],
            connectedSockets,
            chatRooms,
            gameRooms,
            gameName: `ranked-${rankedGameCurrentNumber}`,
            defaultCountdownNumber,
            isRanked: true,
          });
          clientJoinsGame({
            io,
            socket: io.sockets.sockets[bestMatch.challenger.socketId],
            connectedSockets,
            chatRooms,
            gameRooms,
            gameName: `ranked-${rankedGameCurrentNumber}`,
          });
          rankedGameCurrentNumber += 1;
          // remove matched players from queue
          delete rankedQueue.users[bestMatch.host.socketId];
          delete rankedQueue.users[bestMatch.challenger.socketId];
          if (Object.keys(rankedQueue.users).length < 1)
            clearInterval(rankedQueue.matchmakingInterval);
          delete rankedQueue.matchmakingInterval;
          bestMatchEloDiff = null;
          bestMatch = null;
        }
      } else {
        // increase threshold
        if (nextEloThresholdIncrease < 3000) {
          rankedQueue.currentEloDiffThreshold += nextEloThresholdIncrease;
          nextEloThresholdIncrease = nextEloThresholdIncrease * 2;
        }
      }
    }, 1000);
  }
}

module.exports = clientClicksRanked;
