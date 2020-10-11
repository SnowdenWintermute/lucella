function cancelGameCountdown({ io, gameRoom }) {
  if (!gameRoom.countdownInterval) return; // this is needed because wouldn't exist if no one started a countdown yet
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
