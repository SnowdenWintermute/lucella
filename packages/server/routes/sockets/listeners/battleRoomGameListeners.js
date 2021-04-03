const generateGameDataForClient = require("../../../utils/generateGameDataForClient");
const queueUpGameCommand = require("../battleRoomGame/queueUpGameCommand");

const battleRoomGameListeners = ({ application }) => {
  const { socket, connectedSockets, gameRooms, gameDatas } = application;
  const gameName = connectedSockets[socket.id].currentGameName;
  socket.on("clientSendsOrbSelections", (data) => {
    console.log("clientSendsOrbSelections", data)
    if (!gameRooms[gameName]) return;
    queueUpGameCommand({
      application,
      gameName,
      data,
      commandType: "orbSelect",
    });
  });
  socket.on("clientSubmitsMoveCommand", (data) => {
    console.log("clientSubmitsMoveCommand", data)
    if (!gameRooms[gameName]) return;
    queueUpGameCommand({
      application,
      gameName,
      data,
      commandType: "orbMove",
    });
  });
  socket.on("selectAndMoveOrb", (data) => {
    console.log("selectAndMoveOrb", data)
    queueUpGameCommand({
      application,
      gameName,
      data,
      commandType: "orbSelectAndMove",
    });
  });
  socket.on("clientRequestsGameData", () => {
    console.log("clientRequestsGameData")
    socket.emit(
      "serverSendsFullGameData",
      generateGameDataForClient({ gameData: gameDatas[gameName] })
    );
  });
};

module.exports = battleRoomGameListeners;
