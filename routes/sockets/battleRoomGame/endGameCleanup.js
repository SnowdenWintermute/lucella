const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");

function endGameCleanup({
  io,
  socket,
  gameRoom,
  gameData,
  gameRooms,
  gameDatas,
  gameDataIntervals,
  gameEndingIntervals,
  connectedSockets,
}) {
  gameRoom.gameStatus = "ending";
  clearInterval(gameDataIntervals[gameRoom.gameName]);
  delete gameDataIntervals[gameRoom.gameName];
  gameEndingIntervals[gameRoom.gameName] = setInterval(() => {
    if (gameData.endingStateCountdown < 2) {
      io.to(`game-${gameRoom.gameName}`).emit("showEndScreen", gameData);
      clearInterval(gameEndingIntervals[gameRoom.gameName]);
      delete gameEndingIntervals[gameRoom.gameName];
      delete gameDatas[gameRoom.gameName];
      // remove the host from the game, thereby removing all players and destroying the game
      clientLeavesGame({
        io,
        socket,
        gameRooms,
        connectedSockets,
        chatRooms,
        gameName: gameRoom.gameName,
        currentUser: gameRoom.players.host,
        gameCountdownIntervals,
        defaultCountdownNumber,
      });

      io.sockets.emit("gameListUpdate", gameRooms);
      io.to(`game-${gameRoom.gameName}`).emit("currentGameRoomUpdate", null);
    } else {
      gameRoom.endingStateCountdown -= 1;
      io.to(`game-${gameRoom.gameName}`).emit(
        "gameEndingCountdown",
        gameRoom.endingStateCountdown
      );
    }
  }, 1000);
}

module.exports = endGameCleanup;
