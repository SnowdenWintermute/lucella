const cancelGameCountdown = require("../cancelGameCountdown");

module.exports = ({ application, gameName, players }) => {
  const { io, socket, gameRooms } = application;
  const gameRoom = gameRooms[gameName];
  players.challenger = null;
  socket.emit("currentGameRoomUpdate", null);
  cancelGameCountdown({ io, gameRoom });
  gameRoom.playersReady = { host: false, challenger: false };
  io.in(`game-${gameName}`).emit(
    "updateOfCurrentRoomPlayerReadyStatus",
    gameRoom.playersReady
  );
};
