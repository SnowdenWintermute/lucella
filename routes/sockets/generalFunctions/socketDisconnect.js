const removeSocketFromRoom = require("./removeSocketFromRoom");

function socketDisconnect({ io, socket, chatrooms, connectedSockets }) {
  removeSocketFromRoom({ io, socket, connectedSockets, chatrooms });
  console.log(`${socket.id} disconnected`);
}

module.exports = socketDisconnect;
