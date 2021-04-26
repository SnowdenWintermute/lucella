const sendPlayerBackToLobby = require("./sendPlayerBackToLobby");

module.exports = ({ application, gameName, eloUpdates }) => {
  const { io, connectedSockets, gameRooms, gameDatas } = application;
  const gameRoom = gameRooms[gameName];
  const gameData = gameDatas[gameName];
  return setInterval(() => {
    if (gameData.endingStateCountdown < 1) {
      clearInterval(gameData.intervals.endingCountdown);
      const host = connectedSockets[gameRoom.players.host.socketId];
      const challenger = connectedSockets[gameRoom.players.challenger.socketId];
      io.in(`game-${gameName}`).emit("showEndScreen", {
        gameRoom,
        gameData,
        eloUpdates,
      });
      io.in(`game-${gameName}`).emit("currentGameRoomUpdate", null);
      sendPlayerBackToLobby({ application, player: host });
      sendPlayerBackToLobby({ application, player: challenger });
      delete gameDatas[gameName];
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
};
