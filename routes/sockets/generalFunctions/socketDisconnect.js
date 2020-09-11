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
  gameCountdownIntervals,
  gameDataIntervals,
  gameEndingIntervals,
  defaultCountdownNumber,
}) {
  if (connectedSockets[socket.id].currentGameName) {
    clientLeavesGame({
      io,
      socket,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameDatas,
      gameName,
      gameCountdownIntervals,
      gameDataIntervals,
      gameEndingIntervals,
      defaultCountdownNumber,
      isDisconnecting: true,
    });
  } else {
    removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
  }
  delete connectedSockets[socket.id];
  console.log(`${socket.id} disconnected`);
}

module.exports = socketDisconnect;
