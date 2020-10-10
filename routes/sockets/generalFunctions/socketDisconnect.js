const removeSocketFromRoom = require("./removeSocketFromRoom");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");

function socketDisconnect({
  io,
  socket,
  connectedSockets,
  chatRooms,
  gameRooms,
  gameDatas,
  gameName,
}) {
  if (gameName) {
    console.log(gameName);
    clientLeavesGame({
      io,
      socket,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameDatas,
      gameName,
      isDisconnecting: true,
    });
  } else {
    removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
  }
  delete connectedSockets[socket.id];
  console.log(`${socket.id} disconnected`);
}

module.exports = socketDisconnect;
