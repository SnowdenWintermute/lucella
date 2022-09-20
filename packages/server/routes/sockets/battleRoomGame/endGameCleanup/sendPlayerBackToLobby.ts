const clientRequestsToJoinChatChannel = require("../../lobbyFunctions/clientRequestsToJoinChatChannel");

module.exports = ({ application, player }) => {
  if (!player) return;
  const { io, connectedSockets } = application;
  player.currentGameName = null;
  clientRequestsToJoinChatChannel({
    application: {
      ...application,
      socket: io.sockets.sockets[player.socketId],
    },
    username: player.username,
    roomName: connectedSockets[player.socketId].\previousChatChannelName,
  });
};
