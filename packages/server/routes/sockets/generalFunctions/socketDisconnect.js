const removeSocketFromRoom = require("./removeSocketFromRoom");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");

module.exports = ({ application, gameName }) => {
  const { socket, connectedSockets } = application;
  console.log("gameName: ", gameName)
  if (gameName)
    clientLeavesGame({
      application,
      gameName,
      isDisconnecting: true,
    });
  else removeSocketFromRoom({ application });
  delete connectedSockets[socket.id];
};
