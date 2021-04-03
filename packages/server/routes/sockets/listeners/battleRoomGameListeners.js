const generateGameDataForClient = require("../../../utils/generateGameDataForClient");
const queueUpGameCommand = require("../battleRoomGame/queueUpGameCommand");

const battleRoomGameListeners = ({ application }) => {
  const { socket, connectedSockets, gameRooms, gameDatas } = application;
  const gameName = connectedSockets[socket.id].currentGameName;
  socket.on("clientSendsOrbSelections", (data) => {
    if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    queueUpGameCommand({
      application,
      gameName: connectedSockets[socket.id].currentGameName,
      data,
      commandType: "orbSelect",
    });
  });
  socket.on("clientSubmitsMoveCommand", (data) => {
    if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    queueUpGameCommand({
      application,
      gameName: connectedSockets[socket.id].currentGameName,
      data,
      commandType: "orbMove",
    });
  });
  socket.on("selectAndMoveOrb", (data) => {
    if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    queueUpGameCommand({
      application,
      gameName: connectedSockets[socket.id].currentGameName,
      data,
      commandType: "orbSelectAndMove",
    });
  });
  socket.on("clientRequestsGameData", () => {
    if(!gameName) return
    socket.emit(
      "serverSendsFullGameData",
      generateGameDataForClient({ gameData: gameDatas[gameName] })
    );
  });
};

module.exports = battleRoomGameListeners;
