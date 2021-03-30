const removeSocketFromRoom = require("../../lobbyFunctions/removeSocketFromRoom");

module.exports = ({ application, gameName }) => {
  const { socket, connectedSockets, gameRooms } = application;
  const gameRoom = gameRooms[gameName];
  const userThatDisconnected = connectedSockets[socket.id];
  removeSocketFromRoom({
    application,
    nameOfRoomToLeave: `game-${gameName}`,
  });
  gameRoom.winner =
    gameRoom.players.host.username === userThatDisconnected.username
      ? gameRoom.players.challenger.username
      : gameRoom.players.host.username;
};
