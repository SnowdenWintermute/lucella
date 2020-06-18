const socketRequestsToJoinRoom = require("./clientRequestsToJoinRoom");
const cancelGameCountdown = require("./cancelGameCountdown");
const generateGameForClient = require("../../../utils/generateGameForClient");

function clientLeavesGame({
  io,
  socket,
  currentUser,
  connectedSockets,
  chatRooms,
  gameRooms,
  gameName,
  isDisconnecting,
  gameCountdownIntervals,
  defaultCountdownNumber,
}) {
  const username = currentUser.name;
  console.log("client " + username + " requests to leave game " + gameName);
  console.log("clientLeavesGame19");
  console.log(gameRooms[gameName].players);
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
      io.to(`game-${gameName}`).emit("gameClosedByHost", null);
      io.to(`game-${gameName}`).emit("newMessage", {
        author: "Server",
        style: "private",
        message: `Game ${gameName} closed by host.`,
        timeStamp: Date.now(),
      });
      if (gameRooms[gameName].players.challenger) {
        let socketIdToRemove = gameRooms[gameName].players.challenger.socketId;
        connectedSockets[socketIdToRemove].isInGame = false;
        console.log("removing challenger");
        console.log(connectedSockets[socketIdToRemove]);
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
      delete gameRooms[gameName];
      // CHALLENGER LEAVING
    } else if (gameRooms[gameName].players.challenger) {
      console.log("challenger leaving");
      if (gameRooms[gameName].players.challenger.username === username) {
        gameRooms[gameName].players.challenger = null;
        socket.emit("currentGameRoomUpdate", null);
      }
      // cancel the countdown and unready everyone
      cancelGameCountdown({
        io,
        gameRoom: gameRooms[gameName],
        gameCountdownIntervals,
        defaultCountdownNumber,
      });
      gameRooms[gameName].playersReady = { host: false, challenger: false };
      io.in(`game-${gameName}`).emit(
        "updateOfCurrentRoomPlayerReadyStatus",
        gameRooms[gameName].playersReady
      );
    }
    // EITHER HOST OR CHALLENGER LEAVES
    connectedSockets[socket.id].isInGame = false;
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

    gameRoomForClient = gameRooms[gameName]
      ? generateGameForClient({
          gameObject: gameRooms[gameName],
        })
      : null;
    io.to(`game-${gameName}`).emit("currentGameRoomUpdate", gameRoomForClient);
    io.sockets.emit("gameListUpdate", gameRooms);
  } catch (err) {
    console.log(err);
  }
}

module.exports = clientLeavesGame;
