const clientRequestsToJoinRoom = require("../clientRequestsToJoinRoom");
const cancelGameCountdown = require("../cancelGameCountdown");
const removeSocketFromRoom = require("../../generalFunctions/removeSocketFromRoom");
const generateGameRoomForClient = require("../../../../utils/generateGameRoomForClient");
const generateRoomForClient = require("../../../../utils/generateRoomForClient");
const handleHostLeavingGameSetup = require('./handleHostLeavingGameSetup')

module.exports = ({ application, gameName, isDisconnecting }) => {
  const { io, socket, connectedSockets, chatRooms, gameRooms } = application;
  const username = connectedSockets[socket.id].username;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  if (players.host.username === username)
    handleHostLeavingGameSetup({ application, gameName });
  else if (players.challenger.username === username) {
    // CHALLENGER LEAVING
    players.challenger = null;
    socket.emit("currentGameRoomUpdate", null);
    // cancel the countdown and unready everyone
    cancelGameCountdown({ io, gameRoom });
    gameRoom.playersReady = { host: false, challenger: false };
    io.in(`game-${gameName}`).emit(
      "updateOfCurrentRoomPlayerReadyStatus",
      gameRoom.playersReady
    );
  }
  // EITHER HOST OR CHALLENGER LEAVES
  if (isDisconnecting) {
    removeSocketFromRoom({ application });
    // if dc from ranked game, remove the other player too
    if (gameRoom.isRanked) {
      const socketToRemove = connectedSockets.forEach((connectedSocket) => {
        if (connectedSockets[connectedSocket].currentGameName === gameName)
          return connectedSocket;
      });
      removeSocketFromRoom({
        application: { ...application, socket: socketToRemove },
      });
    }
  } else {
    connectedSockets[socket.id].isInGame = false;
    const prevRoom = connectedSockets[socket.id].previousRoomName;
    clientRequestsToJoinRoom({
      application,
      username,
      roomName: prevRoom ? prevRoom : "the void",
    });
  }
  if (!players.host) {
    console.log("do we ever get here")
    delete gameRooms[gameName];
    delete chatRooms[gameName];
  } else {
    gameRoomForClient = gameRoom
      ? generateGameRoomForClient({ gameRoom })
      : null;
    io.in(`game-${gameName}`).emit("currentGameRoomUpdate", gameRoomForClient);
    const chatRoomForClient = generateRoomForClient({
      chatRooms,
      roomName: `game-${gameName}`,
    });
    io.in(`game-${gameName}`).emit("updateChatRoom", chatRoomForClient);
  }
};
