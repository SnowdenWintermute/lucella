const clientRequestsToJoinRoom = require("../lobbyFunctions/clientRequestsToJoinRoom");
const updateWinLossRecords = require("./updateWinLossRecords");

async function endGameCleanup({
  io,
  socket,
  gameRoom,
  gameData,
  gameRooms,
  chatRooms,
  gameDatas,
  gameDataIntervals,
  gameEndingIntervals,
  connectedSockets,
  isDisconnecting,
}) {
  if (gameRoom.gameStatus === "ending") return;
  gameRoom.gameStatus = "ending";
  io.in(`game-${gameRoom.gameName}`).emit(
    "currentGameStatusUpdate",
    gameRoom.gameStatus,
  );
  io.to(`game-${gameRoom.gameName}`).emit(
    "gameEndingCountdown",
    gameData.endingStateCountdown,
  );
  clearInterval(gameDataIntervals[gameRoom.gameName]);
  delete gameDataIntervals[gameRoom.gameName];
  gameRoom.winner =
    gameData.winner === "host"
      ? gameRoom.players.host.username
      : gameRoom.players.challenger.username;
  const loser =
    gameRoom.winner === gameRoom.players.host.username
      ? gameRoom.players.challenger.username
      : gameRoom.players.host.username;

  // update game records in mongodb
  const eloUpdates = await updateWinLossRecords({
    winner: gameRoom.winner,
    loser,
    gameRoom,
    gameData,
    isRanked: true,
  });

  io.in(`game-${gameRoom.gameName}`).emit(
    "serverSendsWinnerInfo",
    gameRoom.winner,
  );
  gameEndingIntervals[gameRoom.gameName] = setInterval(() => {
    if (gameData.endingStateCountdown < 2) {
      clearInterval(gameEndingIntervals[gameRoom.gameName]);
      const host = connectedSockets[gameRoom.players.host.socketId];
      const challenger = connectedSockets[gameRoom.players.challenger.socketId];
      host.isInGame = false;
      challenger.isInGame = false;

      io.in(`game-${gameRoom.gameName}`).emit("showEndScreen", {
        gameRoom,
        gameData,
        eloUpdates,
      });
      io.in(`game-${gameRoom.gameName}`).emit("currentGameRoomUpdate", null);
      clientRequestsToJoinRoom({
        io,
        socket: io.sockets.sockets[host.socketId],
        roomToJoin: connectedSockets[host.socketId].previousRoom,
        chatRooms,
        username: host.username,
        connectedSockets,
      });
      clientRequestsToJoinRoom({
        io,
        socket: io.sockets.sockets[challenger.socketId],
        roomToJoin: connectedSockets[challenger.socketId].previousRoom,
        chatRooms,
        username: challenger.username,
        connectedSockets,
      });

      delete gameEndingIntervals[gameRoom.gameName];
      delete gameDatas[gameRoom.gameName];
      delete gameRooms[gameRoom.gameName];
      io.sockets.emit("gameListUpdate", gameRooms);
    } else {
      gameData.endingStateCountdown -= 1;
      io.to(`game-${gameRoom.gameName}`).emit(
        "gameEndingCountdown",
        gameData.endingStateCountdown,
      );
    }
  }, 1000);
}

module.exports = endGameCleanup;
