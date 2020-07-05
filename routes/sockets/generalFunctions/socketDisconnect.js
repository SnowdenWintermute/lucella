const removeSocketFromRoom = require("./removeSocketFromRoom");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");

function socketDisconnect({
  io,
  socket,
  currentUser,
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
  if (currentUser.currentGameName) {
    clientLeavesGame({
      io,
      socket,
      currentUser,
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
  console.log(`${socket.id} disconnected`);
}

module.exports = socketDisconnect;
