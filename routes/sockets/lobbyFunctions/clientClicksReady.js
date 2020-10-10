startGameCountdown = require("./startGameCountdown");
cancelGameCountdown = require("./cancelGameCountdown");

function clientClicksReady({
  io,
  socket,
  connectedSockets,
  gameRooms,
  chatRooms,
  gameDatas,
  gameName,
  fromServer,
}) {
  if (!connectedSockets[socket.id].isInGame) return;
  if (!gameRooms[gameName]) return;
  if (gameRooms[gameName].isRanked && !fromServer) return; // can't unready if matched through matchmaking
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
      chatRooms,
      gameDatas,
      gameRoom: gameRooms[gameName],
    });
  } else {
    // cancel current countdown if one exists
    cancelGameCountdown({
      io,
      gameRoom: gameRooms[gameName],
    });
  }
}

module.exports = clientClicksReady;
