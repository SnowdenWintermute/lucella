function cancelGameCountdown({ io, gameRoom }) {
  if (!gameRoom.countdownInterval) return;
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
}

module.exports = cancelGameCountdown;
