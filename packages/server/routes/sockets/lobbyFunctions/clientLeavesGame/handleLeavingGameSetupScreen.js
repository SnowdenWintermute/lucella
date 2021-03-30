const clientRequestsToJoinRoom = require("../clientRequestsToJoinRoom");
const generateGameRoomForClient = require("../../../../utils/generateGameRoomForClient");
const generateRoomForClient = require("../../../../utils/generateRoomForClient");
const handleHostLeavingGameSetup = require("./handleHostLeavingGameSetup");
const handleChallengerLeavingGameSetup = require("./handleChallengerLeavingGameSetup");
const handleDisconnectionFromGameSetup = require("./handleDisconnectionFromGameSetup");

module.exports = ({ application, gameName, isDisconnecting }) => {
  const { io, socket, connectedSockets, chatRooms, gameRooms } = application;
  const username = connectedSockets[socket.id].username;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  if (isDisconnecting)
    handleDisconnectionFromGameSetup({ application, gameRoom });
  else {
    connectedSockets[socket.id].currentGameName = null
    socket.emit("currentGameRoomUpdate", null)
    const prevRoom = connectedSockets[socket.id].previousRoomName;
    clientRequestsToJoinRoom({
      application,
      username,
      roomName: prevRoom ? prevRoom : "the void",
    });
  }
  if (players.host.username === username)
    handleHostLeavingGameSetup({ application, gameName });
  else if (players.challenger.username === username)
    handleChallengerLeavingGameSetup({ application, gameName, players });
  if (!players.host) {
    delete gameRooms[gameName];
    delete chatRooms[gameName];
  }

  io.in(`game-${gameName}`).emit(
    "currentGameRoomUpdate",
    generateGameRoomForClient({ gameRoom })
  );
  io.in(`game-${gameName}`).emit(
    "updateChatRoom",
    generateRoomForClient({
      chatRooms,
      roomName: `game-${gameName}`,
    })
  );

};
