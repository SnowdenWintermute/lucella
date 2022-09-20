const removeSocketFromChatChannel = require("../removeSocketFromChatChannel");

module.exports = ({ application, gameRoom }) => {
  removeSocketFromChatChannel({ application });
  if (gameRoom.isRanked) {
    const socketToRemove = connectedSockets.forEach((connectedSocket) => {
      if (connectedSockets[connectedSocket].currentGameName === gameName) return connectedSocket;
    });
    removeSocketFromChatChannel({
      application: { ...application, socket: socketToRemove },
    });
  }
};
