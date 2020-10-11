const clientRequestsToJoinRoom = require("./clientRequestsToJoinRoom");
const generateGameForClient = require("../../../utils/generateGameForClient");
const generateGamesForClient = require("../../../utils/generateGamesForClient");

function clientJoinsGame({
  io,
  socket,
  connectedSockets,
  chatRooms,
  gameRooms,
  gameName,
}) {
  const username = connectedSockets[socket.id].username;
  try {
    // can't join a game that doesn't exist
    if (!gameRooms[gameName])
      return socket.emit("errorMessage", "No game by that name exists");
    // if no host, means this is being joined by the host right after creating it
    if (!connectedSockets[socket.id].isInGame) {
      if (!gameRooms[gameName].players.host) {
        gameRooms[gameName].players.host = connectedSockets[socket.id];
        console.log(username + " joined game " + gameName + " as host");
        socket.emit("serverSendsPlayerDesignation", "host"); // so the client knows who's orbs to try to move
        // they can't move anyone elses orbs though because it will check if the uid they are using match their socket on server
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
        socket.emit("serverSendsPlayerDesignation", "challenger");
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
        authorizedForGameChannel: true,
      });
      connectedSockets[socket.id].isInGame = true;
      gamesForClient = generateGamesForClient({ gamesObject: gameRooms });
      io.sockets.emit("gameListUpdate", gamesForClient);
      gameRoomForClient = generateGameForClient({
        gameObject: gameRooms[gameName],
      });
      io.to(`game-${gameName}`).emit(
        "currentGameRoomUpdate",
        gameRoomForClient
      );
      connectedSockets[socket.id].currentGameName = gameName;
    } else {
      socket.emit("errorMessage", "You are already in a game");
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = clientJoinsGame;