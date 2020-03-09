function clientLeavesGame({
  io,
  socket,
  connectedSockets,
  gameRooms,
  gameName,
  username
}) {
  try {
    if (!gameRooms[gameName])
      socket.emit("errorMessage", "No game by that name exists");
      if(!connectedSockets[socket.id].isInGame) console.log("tried to leave a game that no longer exists")
      // if they are the host, destroy the game and kick all players out of it
      if(gameRooms[gameName].players.host.username === username){

        delete gameRooms[gameName]
      }
  //   if (!connectedSockets[socket.id].isInGame) {
  //     if (!gameRooms[gameName].players.host)
  //       gameRooms[gameName].players.host = connectedSockets[socket.id];
  //     else if (!gameRooms[gameName.players.challenger])
  //       gameRooms[gameName.players.challenger] = connectedSockets[socket.id];
  //     else {
  //       return socket.emit("errorMessage", "That game is currently full");
  //     }
  //     connectedSockets[socket.id].isInGame = true;
  //     socket.join(`game-${gameName}`);
  //     socket.emit("updateSocketInGameStatus", true);
  //     io.sockets.emit("gameListUpdate", gameRooms);
  //     io.to(`game-${gameName}`).emit(
  //       "currentGameRoomUpdate",
  //       gameRooms[gameName],
  //     );
  //     console.log(`socket ${socket.id} joined game named ${gameName}`);
  //   } else {
  //     socket.emit("errorMessage", "You are already in a game");
  //   }
  // } catch (err) {
  //   console.log(err);
  // }
}

module.exports = clientLeavesGame;
