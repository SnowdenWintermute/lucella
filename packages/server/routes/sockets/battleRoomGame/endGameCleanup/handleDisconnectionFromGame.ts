const removeSocketFromChatChannel = require("../../lobbyFunctions/removeSocketFromChatChannel");

module.exports = ({ application, gameName }) => {
  const { socket, connectedSockets, gameRooms } = application;
  const gameRoom = gameRooms[gameName];
  const userThatDisconnected = connectedSockets[socket.id];
  removeSocketFromChatChannel({
    application,
    nameOfChatChannelToLeave: `game-${gameName}`,
  });
  gameRoom.winner =
    gameRoom.players.host.username === userThatDisconnected.username
      ? gameRoom.players.challenger.username
      : gameRoom.players.host.username;
};
