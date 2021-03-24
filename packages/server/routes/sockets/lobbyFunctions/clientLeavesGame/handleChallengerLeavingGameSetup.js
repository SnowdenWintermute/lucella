const cancelGameCountdown = require("../cancelGameCountdown");

module.exports = ({ application, gameRoom, players }) => {
  const { io, socket } = application
  players.challenger = null;
  socket.emit("currentGameRoomUpdate", null);
  // cancel the countdown and unready everyone
  cancelGameCountdown({ io, gameRoom });
  gameRoom.playersReady = { host: false, challenger: false };
  io.in(`game-${gameName}`).emit(
    "updateOfCurrentRoomPlayerReadyStatus",
    gameRoom.playersReady
  );
}