startGame = require("../battleRoomGame/startGame");
//
function startGameCountdown({
  io,
  socket,
  connectedSockets,
  gameRooms,
  chatRooms,
  gameDatas,
  gameRoom,
}) {
  gameRoom.gameStatus = "countingDown";
  console.log("status: " + gameRoom.gameStatus);
  io.to(`game-${gameRoom.gameName}`).emit(
    "currentGameStatusUpdate",
    gameRoom.gameStatus
  );
  gameRoom.countdownInterval = setInterval(() => {
    if (gameRoom.countdown === 0) {
      gameRoom.gameStatus = "inProgress";
      io.to(`game-${gameRoom.gameName}`).emit(
        "currentGameStatusUpdate",
        gameRoom.gameStatus
      );
      // start the game ticks
      startGame({
        io,
        socket,
        connectedSockets,
        gameRooms,
        chatRooms,
        gameRoom,
        gameDatas,
      });
      return clearInterval(gameRoom.countdownInterval);
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
