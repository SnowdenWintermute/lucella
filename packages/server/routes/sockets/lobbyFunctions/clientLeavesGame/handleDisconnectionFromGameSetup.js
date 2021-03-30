const removeSocketFromRoom = require("../removeSocketFromRoom");

module.exports = ({ application, gameRoom }) => {
  removeSocketFromRoom({ application });
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