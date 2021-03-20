const clientRequestsToJoinRoom = require("../lobbyFunctions/clientRequestsToJoinRoom");
const updateWinLossRecords = require("./updateWinLossRecords");

async function endGameCleanup({ application, gameName, isDisconnecting }) {
  const { io, socket, gameRooms, connectedSockets } = application;
  const gameRoom = application.gameRooms[gameName];
  const gameData = application.gameDatas[gameName];
  const { gameName } = gameRoom;
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
  if (!isDisconnecting)
    gameRoom.winner =
      gameData.winner === "host"
        ? gameRoom.players.host.username
        : gameRoom.players.challenger.username;
  else {
    const userThatDisconnected = connectedSockets[socket.id];
    gameRoom.winner =
      gameRoom.players.host.username === userThatDisconnected.username
        ? gameRoom.players.challenger.username
        : gameRoom.players.host.username;
  }

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
    isRanked: gameRoom.isRanked,
  });

  io.in(`game-${gameName}`).emit("serverSendsWinnerInfo", gameRoom.winner);
  gameData.intervals.endingCountdown = setInterval(() => {
    if (gameData.endingStateCountdown < 2) {
      clearInterval(gameData.intervals.endingCountdown);
      const host = connectedSockets[gameRoom.players.host.socketId];
      const challenger = connectedSockets[gameRoom.players.challenger.socketId];

      io.in(`game-${gameName}`).emit("showEndScreen", {
        gameRoom,
        gameData,
        eloUpdates,
      });
      io.in(`game-${gameName}`).emit("currentGameRoomUpdate", null);
      // if they didn't dc, put them back in a room
      if (host) {
        host.isInGame = false;
        clientRequestsToJoinRoom({
          application: {
            ...application,
            socket: io.sockets.sockets[host.socketId],
          },
          username: host.username,
          roomToJoin: connectedSockets[host.socketId].previousRoom,
        });
      }
      if (challenger) {
        challenger.isInGame = false;
        clientRequestsToJoinRoom({
          application: {
            ...application,
            socket: io.sockets.sockets[challenger.socketId],
          },
          username: challenger.username,
          roomToJoin: connectedSockets[challenger.socketId].previousRoom,
        });
      }

      delete gameData;
      delete gameRoom;
      io.sockets.emit("gameListUpdate", gameRooms);
    } else {
      gameData.endingStateCountdown -= 1;
      io.to(`game-${gameName}`).emit(
        "gameEndingCountdown",
        gameData.endingStateCountdown
      );
    }
  }, 1000);
}

module.exports = endGameCleanup;
