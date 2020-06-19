function cancelGameCountdown({
  io,
  gameRoom,
  gameCountdownIntervals,
  defaultCountdownNumber,
}) {
  if (!gameCountdownIntervals) return; // this is needed because wouldn't exist if no one started a countdown yet
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
