const removeSocketFromChatChannel = require("../lobbyFunctions/removeSocketFromChatChannel");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");

module.exports = ({ application, gameName }) => {
  const { socket, connectedSockets } = application;
  console.log(socket.id + " disconnected");
  if (gameName)
    clientLeavesGame({
      application,
      gameName,
      isDisconnecting: true,
    });
  else removeSocketFromChatChannel({ application });
  delete connectedSockets[socket.id];
};
