const clientRequestsToJoinRoom = require("../../lobbyFunctions/clientRequestsToJoinRoom");

module.exports = ({ application, player }) => {
  if (!player) return;
  const { io, connectedSockets } = application;
  player.currentGameName = null
  clientRequestsToJoinRoom({
    application: {
      ...application,
      socket: io.sockets.sockets[player.socketId],
    },
    username: player.username,
    roomName: connectedSockets[player.socketId].previousRoomName,
  });
};
