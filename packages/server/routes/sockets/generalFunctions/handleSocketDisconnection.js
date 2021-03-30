const removeSocketFromRoom = require("../lobbyFunctions/removeSocketFromRoom");
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
  else removeSocketFromRoom({ application });
  delete connectedSockets[socket.id];
};
