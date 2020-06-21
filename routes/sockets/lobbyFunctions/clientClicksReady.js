startGameCountdown = require("./startGameCountdown");
cancelGameCountdown = require("./cancelGameCountdown");

function clientClicksReady({
  io,
  socket,
  connectedSockets,
  gameRooms,
  gameDatas,
  gameName,
  gameDataIntervals,
  gameUpdatePackets,
  gameEndingIntervals,
  gameCountdownIntervals,
  defaultCountdownNumber,
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
  io.to(`game-${gameName}`).emit(
    "updateOfCurrentRoomPlayerReadyStatus",
    gameRooms[gameName].playersReady
  );
  // if both host and challenger are ready, start the countdown
  if (
    gameRooms[gameName].playersReady.host &&
    gameRooms[gameName].playersReady.challenger
  ) {
    startGameCountdown({
      io,
      socket,
      connectedSockets,
      gameRooms,
      gameDatas,
      gameRoom: gameRooms[gameName],
      gameDataIntervals,
      gameUpdatePackets,
      gameEndingIntervals,
      gameCountdownIntervals,
    });
  } else {
    // cancel current countdown if one exists
    cancelGameCountdown({
      io,
      gameRoom: gameRooms[gameName],
      gameCountdownIntervals,
      defaultCountdownNumber,
    });
  }
}

module.exports = clientClicksReady;
