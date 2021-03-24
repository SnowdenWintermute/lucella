const clientRequestsToJoinRoom = require("../clientRequestsToJoinRoom");
const generateGameRoomForClient = require("../../../../utils/generateGameRoomForClient");
const generateRoomForClient = require("../../../../utils/generateRoomForClient");
const handleHostLeavingGameSetup = require('./handleHostLeavingGameSetup');
const handleDisconnectionFromGameSetup = require("./handleDisconnectionFromGameSetup");

module.exports = ({ application, gameName, isDisconnecting }) => {
  const { io, socket, connectedSockets, chatRooms, gameRooms } = application;
  const username = connectedSockets[socket.id].username;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  if (players.host.username === username)
    handleHostLeavingGameSetup({ application, gameName });
  else if (players.challenger.username === username)
    handleChallengerLeavingGameSetup({ application, gameRoom, players })

  if (isDisconnecting)
    handleDisconnectionFromGameSetup({ application, gameRoom })
  else {
    connectedSockets[socket.id].isInGame = false;
    const prevRoom = connectedSockets[socket.id].previousRoomName;
    clientRequestsToJoinRoom({
      application,
      username,
      roomName: prevRoom ? prevRoom : "the void",
    });
  }
  if (!players.host) {
    delete gameRooms[gameName];
    delete chatRooms[gameName];
  } else {
    io.in(`game-${gameName}`).emit("currentGameRoomUpdate", generateGameRoomForClient({ gameRoom }));
    io.in(`game-${gameName}`).emit("updateChatRoom", generateRoomForClient({
      chatRooms,
      roomName: `game-${gameName}`,
    }));
  }
};
