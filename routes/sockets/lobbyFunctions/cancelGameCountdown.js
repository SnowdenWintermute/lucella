function cancelGameCountdown({
  io,
  gameRoom,
  gameCountdownIntervals,
  defaultCountdownNumber,
}) {
  if (!gameCountdownIntervals[gameRoom.gameName]) return;
  gameRoom.gameStatus = "inLobby";
  io.to(`game-${gameRoom.gameName}`).emit(
    "currentGameStatusUpdate",
    gameRoom.gameStatus
  );
  clearInterval(gameCountdownIntervals[gameRoom.gameName]);
  gameRoom.countdown = defaultCountdownNumber;
  io.to(`game-${gameRoom.gameName}`).emit(
    "currentGameCountdownUpdate",
    gameRoom.countdown
  );
}

module.exports = cancelGameCountdown;
