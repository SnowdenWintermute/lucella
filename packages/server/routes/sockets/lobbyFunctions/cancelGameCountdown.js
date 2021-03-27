module.exports = ({ io, gameRoom }) => {
  if (!gameRoom.countdownInterval)
    return new Error("There is no countdown to cancel");
  gameRoom.gameStatus = "inLobby";
  io.to(`game-${gameRoom.gameName}`).emit(
    "currentGameStatusUpdate",
    gameRoom.gameStatus
  );
  clearInterval(gameRoom.countdownInterval);
  gameRoom.countdown = gameRoom.countdownStartsAt;
  io.to(`game-${gameRoom.gameName}`).emit(
    "currentGameCountdownUpdate",
    gameRoom.countdown
  );
};
