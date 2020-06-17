function clientClicksReady({
  io,
  socket,
  connectedSockets,
  gameRooms,
  gameName,
}) {
  if (!connectedSockets[socket.id].isInGame) return;
  if (!gameRooms[gameName]) return;
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

  io.to(`game-${gameName}`).emit("updateOfCurrentRoomPlayerReadyStatus", {
    playersReady: gameRooms[gameName].playersReady,
  });
}

module.exports = clientClicksReady;
