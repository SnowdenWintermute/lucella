const removeSocketFromRoom = require("./removeSocketFromRoom");

function socketDisconnect({ io, socket, chatRooms, connectedSockets }) {
  removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
  console.log(`${socket.id} disconnected`);
}

module.exports = socketDisconnect;
