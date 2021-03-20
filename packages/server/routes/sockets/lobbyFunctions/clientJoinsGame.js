const clientRequestsToJoinRoom = require("./clientRequestsToJoinRoom");
const generateGameRoomForClient = require("../../../utils/generateGameRoomForClient");
const generateGamesForClient = require("../../../utils/generateGamesForClient");

function clientJoinsGame({ application, gameName }) {
  const { io, socket, connectedSockets, gameRooms } = application;
  const username = connectedSockets[socket.id].username;
  const gameRoom = gameRooms[gameName];
  try {
    // can't join a game that doesn't exist
    if (!gameRoom)
      return socket.emit("errorMessage", "No game by that name exists");
    // if no host, means this is being joined by the host right after creating it
    if (!connectedSockets[socket.id].isInGame) {
      if (!gameRoom.players.host) {
        gameRoom.players.host = connectedSockets[socket.id];
        socket.emit("serverSendsPlayerDesignation", "host"); // so the client knows who's orbs to try to move
        // they can't move anyone elses orbs though because it will check if the uid they are using matches their socket on server
      } else if (!gameRoom.players.challenger) {
        // can't join game hosted by self
        if (gameRoom.players.host.username === username)
          return socket.emit(
            "errorMessage",
            "You can not join a game hosted by yourself"
          );
        // otherwise join as the challenger
        socket.emit("serverSendsPlayerDesignation", "challenger");
        gameRoom.players.challenger = connectedSockets[socket.id];
      } else return socket.emit("errorMessage", "That game is currently full");

      chatRooms = clientRequestsToJoinRoom({
        application,
        username,
        roomToJoin: `game-${gameName}`,
        authorizedForGameChannel: true,
      });
      connectedSockets[socket.id].isInGame = true;
      gamesForClient = generateGamesForClient({ gamesObject: gameRooms });
      io.sockets.emit("gameListUpdate", gamesForClient);
      gameRoomForClient = generateGameRoomForClient({ gameRoom });
      io.to(`game-${gameName}`).emit(
        "currentGameRoomUpdate",
        gameRoomForClient
      );
      connectedSockets[socket.id].currentGameName = gameName;
    } else socket.emit("errorMessage", "You are already in a game");
  } catch (error) {
    console.log(error);
  }
}

module.exports = clientJoinsGame;
