const queueUpGameCommand = require("../battleRoomGame/queueUpGameCommand");

const battleRoomGameListeners = ({ application }) => {
  const { socket, connectedSockets, gameRooms, gameDatas } = application;
  socket.on("clientSendsOrbSelections", (data) => {
    if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    queueUpGameCommand({
      application,
      gameName: connectedSockets[socket.id].currentGameName,
      data,
      type: "orbSelect",
    });
  });
  socket.on("clientSubmitsMoveCommand", (data) => {
    if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    queueUpGameCommand({
      application,
      gameName: connectedSockets[socket.id].currentGameName,
      data,
      type: "orbMove",
    });
  });
  socket.on("selectAndMoveOrb", (data) => {
    if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    queueUpGameCommand({
      application,
      gameName: connectedSockets[socket.id].currentGameName,
      data,
      type: "orbSelectAndMove",
    });
  });
};

module.exports = battleRoomGameListeners;
