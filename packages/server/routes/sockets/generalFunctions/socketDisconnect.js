const removeSocketFromRoom = require("./removeSocketFromRoom");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");

module.exports = ({ application, gameName }) => {
  const { socket, connectedSockets } = application;
  if (gameName)
    clientLeavesGame({
      application,
      gameName,
      isDisconnecting: true,
    });
  else removeSocketFromRoom({ application });
  delete connectedSockets[socket.id];
};
