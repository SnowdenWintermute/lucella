startGameCountdown = require("./startGameCountdown");
cancelGameCountdown = require("./cancelGameCountdown");

function clientClicksReady({
  io,
  socket,
  connectedSockets,
  gameRooms,
  gameName,
  gameCountdownIntervals,
}) {
  if (!connectedSockets[socket.id].isInGame) return;
  if (!gameRooms[gameName]) return;
  // check who clicked ready
  if (
    gameRooms[gameName].players.host.uuid === connectedSockets[socket.id].uuid
  ) {
    gameRooms[gameName].playersReady.host = !gameRooms[gameName].playersReady
      .host;
  } else if (
    gameRooms[gameName].players.challenger.uuid ===
    connectedSockets[socket.id].uuid
  ) {
    gameRooms[gameName].playersReady.challenger = !gameRooms[gameName]
      .playersReady.challenger;
  }
  // send update of who is currently ready
  io.to(`game-${gameName}`).emit("updateOfCurrentRoomPlayerReadyStatus", {
    playersReady: gameRooms[gameName].playersReady,
  });
  // if both host and challenger are ready, start the countdown
  if (
    gameRooms[gameName].playersReady.host &&
    gameRooms[gameName].playersReady.challenger
  ) {
    startGameCountdown({
      gameRoom: gameRooms[gameName],
      gameCountdownIntervals,
    });
  } else {
    // cancel current countdown if one exists
    cancelGameCountdown({
      gameRoom: gameRooms[gameName],
      gameCountdownIntervals,
    });
  }
}

module.exports = clientClicksReady;
