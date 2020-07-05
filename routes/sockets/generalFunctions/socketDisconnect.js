const removeSocketFromRoom = require("./removeSocketFromRoom");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");

function socketDisconnect({
  io,
  socket,
  currentUser,
  connectedSockets,
  chatRooms,
  gameRooms,
  gameName,
}) {
  console.log("socketDisconnect 13");
  console.log(currentUser);
  if (currentUser.currentGameName) {
    clientLeavesGame({
      io,
      socket,
      currentUser,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameName,
      isDisconnecting: true,
    });
  } else {
    removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
  }
  console.log(`${socket.id} disconnected`);
}

module.exports = socketDisconnect;
