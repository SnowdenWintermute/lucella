startGame = require("../battleRoomGame/startGame");

function startGameCountdown({ application, gameName }) {
  const { io, gameRooms } = application;
  const gameRoom = gameRooms[gameName];
  gameRoom.gameStatus = GameStatus.COUNTING_DOWN;
  io.to(`game-${gameRoom.gameName}`).emit("currentGameStatusUpdate", gameRoom.gameStatus);
  gameRoom.countdownInterval = setInterval(() => {
    if (gameRoom.countdown === 0) {
      gameRoom.gameStatus = GameStatus.IN_PROGRESS;
      io.to(`game-${gameRoom.gameName}`).emit("currentGameStatusUpdate", gameRoom.gameStatus);
      startGame({ application, gameName });
      return clearInterval(gameRoom.countdownInterval);
    }
    gameRoom.countdown--;
    io.to(`game-${gameRoom.gameName}`).emit("currentGameCountdownUpdate", gameRoom.countdown);
  }, 1000);
}

module.exports = startGameCountdown;
