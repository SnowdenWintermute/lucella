const clientRequestsToJoinRoom = require("./clientRequestsToJoinRoom");

function clientJoinsGame({
  io,
  socket,
  connectedSockets,
  currentUser,
  chatRooms,
  gameRooms,
  gameName,
}) {
  const username = currentUser.name;
  console.log("from clientJoinsGame 13");
  console.log(connectedSockets);
  try {
    // can't join a game that doesn't exist
    if (!gameRooms[gameName])
      return socket.emit("errorMessage", "No game by that name exists");
    // if no host, means this is being joined by the host right after creating it
    if (!connectedSockets[socket.id].isInGame) {
      if (!gameRooms[gameName].players.host) {
        gameRooms[gameName].players.host = connectedSockets[socket.id];
        console.log(username + " joined game " + gameName + " as host");
      } else if (!gameRooms[gameName].players.challenger) {
        // can't join game hosted by self
        if (
          gameRooms[gameName].players.host.username ===
          connectedSockets[socket.id].username
        )
          return socket.emit(
            "errorMessage",
            "You can not join a game hosted by yourself"
          );
        // otherwise join as the challenger
        console.log(username + " joined game " + gameName + " as challenger");
        gameRooms[gameName].players.challenger = connectedSockets[socket.id];
      } else {
        return socket.emit("errorMessage", "That game is currently full");
      }
      chatRooms = clientRequestsToJoinRoom({
        io,
        socket,
        roomToJoin: `game-${gameName}`,
        chatRooms,
        connectedSockets,
        username,
      });
      connectedSockets[socket.id].isInGame = true;
      io.sockets.emit("gameListUpdate", gameRooms);
      io.to(`game-${gameName}`).emit(
        "currentGameRoomUpdate",
        gameRooms[gameName]
      );
      currentUser.currentGameName = gameName;
      console.log("from clientJoinsGame:");
      console.log(gameRooms[gameName].players);
    } else {
      socket.emit("errorMessage", "You are already in a game");
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = clientJoinsGame;
