const generateGameDataForClient = require("../../../utils/generateGameDataForClient");
const queueUpGameCommand = require("../battleRoomGame/queueUpGameCommand");

const battleRoomGameListeners = ({ application }) => {
  const { socket, connectedSockets, gameRooms, gameDatas } = application;
  const gameName = connectedSockets[socket.id].currentGameName;
  socket.on("clientSendsOrbSelections", (data) => {
    if (!gameRooms[gameName]) return;
    queueUpGameCommand({
      application,
      gameName,
      data,
      commandType: "orbSelect",
    });
  });
  socket.on("clientSubmitsMoveCommand", (data) => {
    if (!gameRooms[gameName]) return;
    queueUpGameCommand({
      application,
      gameName,
      data,
      commandType: "orbMove",
    });
  });
  socket.on("selectAndMoveOrb", (data) => {
    queueUpGameCommand({
      application,
      gameName,
      data,
      commandType: "orbSelectAndMove",
    });
  });
  socket.on("clientRequestsGameData", () => {
    socket.emit(
      "serverSendsFullGameData",
      generateGameDataForClient({ gameData: gameDatas[gameName] })
    );
  });
};

module.exports = battleRoomGameListeners;
