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
  gameDataIntervals,
  gameUpdatePackets,
  gameCountdownIntervals,
  gameEndingIntervals,
}) {
  gameRoom.gameStatus = "countingDown";
  console.log("status: " + gameRoom.gameStatus);
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
      // start the game ticks
      gameDataIntervals[gameRoom.gameName] = startGame({
        io,
        connectedSockets,
        gameRooms,
        chatRooms,
        gameRoom,
        gameDatas,
        gameDataIntervals,
        gameUpdatePackets,
        gameEndingIntervals,
        gameCountdownIntervals,
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
