startGameCountdown = require("../startGameCountdown");
cancelGameCountdown = require("../cancelGameCountdown");
const togglePlayerReadyState = require("./togglePlayerReadyState");

module.exports = ({ application, gameName }) => {
  try {
    const { io, socket, connectedSockets, gameRooms } = application;
    const gameRoom = gameRooms[gameName];
    const { players, playersReady } = gameRoom;
    if (!connectedSockets[socket.id].currentGameName) throw new Error("Already in game");
    if (!gameRoom) throw new Error("No such game exists");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked)
      throw new Error("Can't unready from ranked game");
    togglePlayerReadyState({ application, players, playersReady });
    io.to(`game-${gameName}`).emit("updateOfcurrentChatChannelPlayerReadyStatus", playersReady);
    if (playersReady.host && playersReady.challenger) startGameCountdown({ application, gameName });
    else cancelGameCountdown({ io, gameRoom });
  } catch (error) {
    console.log(error);
  }
};
