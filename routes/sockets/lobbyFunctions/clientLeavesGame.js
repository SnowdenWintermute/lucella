const socketRequestsToJoinRoom = require("./clientRequestsToJoinRoom");
function clientLeavesGame({
  io,
  socket,
  currentUser,
  connectedSockets,
  chatRooms,
  gameRooms,
  gameName,
  isDisconnecting,
}) {
  const username = currentUser.name;
  console.log("client " + username + " requests to leave game " + gameName);
  try {
    if (!gameRooms[gameName])
      return socket.emit("errorMessage", "No game by that name exists");
    if (!connectedSockets[socket.id].isInGame)
      return console.log("tried to leave a game that no longer exists");
    // HOST LEAVING
    // if they are the host, destroy the game and kick all players out of it
    if (gameRooms[gameName].players.host.username === username) {
      console.log("Host leaving");
      io.to(`game-${gameName}`).emit("currentGameRoomUpdate", null);
      if (gameRooms[gameName].players.challenger) {
        let socketIdToRemove = gameRooms[gameName].players.challenger.socketId;
        connectedSockets[socketIdToRemove].isInGame = false;
        // send challenger to prev room
        const prevRoom = connectedSockets[socketIdToRemove].previousRoom;
        socketRequestsToJoinRoom({
          io,
          socket: io.sockets.connected[socketIdToRemove],
          chatRooms,
          connectedSockets,
          username: gameRooms[gameName].players.challenger.username,
          roomToJoin: prevRoom ? prevRoom : "the void",
          isDisconnecting,
        });
      }
      connectedSockets[socket.id].isInGame = false;
      delete gameRooms[gameName];
      console.log(gameRooms);
      // CHALLENGER LEAVING
    } else if (gameRooms[gameName].players.challenger) {
      console.log("challenger leaving");
      if (gameRooms[gameName].players.challenger.username === username) {
        gameRooms[gameName].players.challenger = null;
        socket.emit("currentGameRoomUpdate", null);
      }
    }
    // EITHER LEAVES
    const prevRoom = connectedSockets[socket.id].previousRoom;
    socketRequestsToJoinRoom({
      io,
      socket,
      chatRooms,
      connectedSockets,
      username,
      roomToJoin: prevRoom ? prevRoom : "the void",
      isDisconnecting,
    });

    io.to(`game-${gameName}`).emit(
      "currentGameRoomUpdate",
      gameRooms[gameName],
    );
    io.sockets.emit("gameListUpdate", gameRooms);
  } catch (err) {
    console.log(err);
  }
}

module.exports = clientLeavesGame;
