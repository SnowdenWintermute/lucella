const updateGameRecords = require("./updateGameRecords");
const handleDisconnectionFromGame = require("./handleDisconnectionFromGame");
const setGameRoomWinnerName = require("./setGameRoomWinnerName");
const createGameEndingCountdownInterval = require("./createGameEndingCountdownInterval");

async function endGameCleanup({ application, gameName, isDisconnecting }) {
  const { io } = application;
  const gameRoom = application.gameRooms[gameName];
  const gameData = application.gameDatas[gameName];
  if (gameRoom.gameStatus === "ending") return;
  gameRoom.gameStatus = "ending";
  io.in(`game-${gameName}`).emit(
    "currentGameStatusUpdate",
    gameRoom.gameStatus
  );
  io.to(`game-${gameName}`).emit(
    "gameEndingCountdown",
    gameData.endingStateCountdown
  );
  clearInterval(gameData.intervals.physics);
  clearInterval(gameData.intervals.updates);
  if (!isDisconnecting) setGameRoomWinnerName({ gameRoom, gameData });
  else handleDisconnectionFromGame({ application, gameName });

  const loser =
    gameRoom.winner === gameRoom.players.host.username
      ? gameRoom.players.challenger.username
      : gameRoom.players.host.username;

  const eloUpdates = await updateGameRecords({
    winner: gameRoom.winner,
    loser,
    gameRoom,
    gameData,
    isRanked: gameRoom.isRanked,
  });

  io.in(`game-${gameName}`).emit("serverSendsWinnerInfo", gameRoom.winner);
  gameData.intervals.endingCountdown = createGameEndingCountdownInterval({
    application,
    gameName,
    eloUpdates,
  });
}

module.exports = endGameCleanup;
