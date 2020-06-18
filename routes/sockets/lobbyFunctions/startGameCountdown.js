const { io } = require("../../../expressServer");

function startGameCountdown({ gameRoom, gameCountdownIntervals }) {
  gameRoom.gameStatus = "countingDown";
  io.to(`game-${gameRoom.gameName}`).emit(
    "currentGameStatusUpdate",
    gameRoom.gameStatus
  );
  gameCountdownIntervals[gameRoom.gameName] = setInterval(() => {
    if (gameRoom.countdown === 0) {
      gameRoom.gameStatus = "inProgress";
      io.to(`game-${gameRoom.gameName}`).emit(
        "currentGameStatusUpdate",
        gameRoom.gameStatus
      );
      return clearInterval(gameCountdownIntervals[gameRoom.gameName]);
      // TODO: start the game ticks
      // startGameTicks()
    }
    gameRoom.countdown--;
    console.log(gameRoom.countdown);
    io.to(`game-${gameRoom.gameName}`).emit(
      "currentGameCountdownUpdate",
      gameRoom.countdown
    );
  }, 1000);
}

module.exports = startGameCountdown;
