const queueUpGameCommand = require("../battleRoomGame/queueUpGameCommand");

module.exports = ({ application }) => {
  const { socket, connectedSockets, gameRooms } = application;
  socket.on("newCommand", (data) => {
    console.log("new command received: ", data)
    if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    const { type, eventData, number } = data
    queueUpGameCommand({
      application,
      gameName: connectedSockets[socket.id].currentGameName,
      type,
      data: eventData,
      number
    });
  });
}