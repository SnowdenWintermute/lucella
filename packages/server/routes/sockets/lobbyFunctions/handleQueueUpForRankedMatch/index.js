const fetchOrCreateBattleRoomRecord = require('./fetchOrCreateBattleRoomRecord')
const putUserInRankedMatchmakingQueue = require('./putUserInRankedMatchmakingQueue')
const createMatchmakingInterval = require('./createMatchmakingInterval')
startGameCountdown = require("../startGameCountdown");
cancelGameCountdown = require("../cancelGameCountdown");
const User = require("../../../../models/User");

async function clientClicksRanked({ application }) {
  const { socket, connectedSockets, rankedQueue } = application;
  if (connectedSockets[socket.id].currentGameName) return socket.emit("errorMessage", "You are already in a game");
  const user = await User.findOne({ name: connectedSockets[socket.id].username });
  if (!user) return socket.emit("errorMessage", "Log in or create an account to play ranked games");
  let userBattleRoomRecord = await fetchOrCreateBattleRoomRecord(user)
  putUserInRankedMatchmakingQueue({ socket, rankedQueue, user, userBattleRoomRecord })
  rankedQueue.currentEloDiffThreshold = 0;
  if (
    rankedQueue.matchmakingInterval === null ||
    !rankedQueue.matchmakingInterval
  ) createMatchmakingInterval({ application })
}

module.exports = clientClicksRanked;
