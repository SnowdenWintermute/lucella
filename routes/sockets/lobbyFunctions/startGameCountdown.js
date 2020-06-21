startGame = require("../battleRoomGame/startGame");

function startGameCountdown({
  io,
  socket,
  connectedSockets,
  gameRooms,
  gameDatas,
  gameRoom,
  gameDataIntervals,
  gameUpdatePackets,
  gameCountdownIntervals,
  gameEndingIntervals,
}) {
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
      // TODO: start the game ticks
      gameDataIntervals[gameRoom.gameName] = startGame({
        io,
        connectedSockets,
        gameRooms,
        gameRoom,
        gameDatas,
        gameDataIntervals,
        gameUpdatePackets,
        gameEndingIntervals,
      });
      return clearInterval(gameCountdownIntervals[gameRoom.gameName]);
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
