const endGameCleanup = require("../battleRoomGame/endGameCleanup");

function clientLeavesGame({ application, gameName, isDisconnecting }) {
  const { io, socket, connectedSockets, gameRooms } = application;
  const gameRoom = gameRooms[gameName];
  try {
    if (!gameRoom)
      return socket.emit("errorMessage", "No game by that name exists");
    if (!connectedSockets[socket.id].isInGame)
      return console.log("tried to leave a game when they weren't in one");
    if (
      gameRoom.gameStatus === "inLobby" ||
      gameRoom.gameStatus === "countingDown"
    ) {
      handleLeavingGameSetupScreen({ application, gameName, isDisconnecting });
    } else {
      endGameCleanup({
        application,
        gameName,
        isDisconnecting,
      });
    }
    io.sockets.emit("gameListUpdate", gameRooms);
  } catch (error) {
    console.log(error);
  }
}

module.exports = clientLeavesGame;
