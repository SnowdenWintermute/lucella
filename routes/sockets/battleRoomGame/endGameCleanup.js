const clientRequestsToJoinRoom = require("../lobbyFunctions/clientRequestsToJoinRoom");
const updateWinLossRecords = require("./updateWinLossRecords");

async function endGameCleanup({
  io,
  socket,
  gameRoom,
  gameData,
  gameRooms,
  chatRooms,
  connectedSockets,
  isDisconnecting,
}) {
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
  if (!isDisconnecting) {
    gameRoom.winner =
      gameData.winner === "host"
        ? gameRoom.players.host.username
        : gameRoom.players.challenger.username;
  } else {
    const userThatDisconnected = connectedSockets[socket.id];
    gameRoom.winner =
      gameRoom.players.host.username === userThatDisconnected.username
        ? gameRoom.players.challenger.username
        : gameRoom.players.host.username;
    console.log(
      "user " +
        userThatDisconnected.username +
        " dc'd, assigning win to " +
        gameRoom.winner
    );
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
          io,
          socket: io.sockets.sockets[host.socketId],
          roomToJoin: connectedSockets[host.socketId].previousRoom,
          chatRooms,
          username: host.username,
          connectedSockets,
        });
      }
      if (challenger) {
        challenger.isInGame = false;
        clientRequestsToJoinRoom({
          io,
          socket: io.sockets.sockets[challenger.socketId],
          roomToJoin: connectedSockets[challenger.socketId].previousRoom,
          chatRooms,
          username: challenger.username,
          connectedSockets,
        });
      }

      delete gameData;
      delete gameRooms[gameName];
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
