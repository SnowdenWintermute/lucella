const removeSocketFromRoom = require("../../generalFunctions/removeSocketFromRoom");

module.exports = ({ application, gameRoom }) => {
  removeSocketFromRoom({ application });
  // if dc from ranked game, remove the other player too
  if (gameRoom.isRanked) {
    const socketToRemove = connectedSockets.forEach((connectedSocket) => {
      if (connectedSockets[connectedSocket].currentGameName === gameName)
        return connectedSocket;
    });
    removeSocketFromRoom({
      application: { ...application, socket: socketToRemove },
    });
  }
}