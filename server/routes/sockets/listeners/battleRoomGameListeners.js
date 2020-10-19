const queueUpGameCommand = require("../battleRoomGame/queueUpGameCommand");

const battleRoomGameListeners = ({
  socket,
  connectedSockets,
  gameRooms,
  gameDatas,
}) => {
  socket.on("clientSendsOrbSelections", (data) => {
    // TODO: check for correct ownership (or maybe it doesn't matter if they hack to select opponent orbs because they can't move them anyway)
    // roomNumber, ownerOfOrbs, orbsToBeUpdated
    const gameName = connectedSockets[socket.id].currentGameName;
    if (!gameRooms[gameName]) return;
    queueUpGameCommand({
      socket,
      connectedSockets,
      gameRooms,
      gameData: gameDatas[gameName],
      data,
      commandType: "orbSelect",
    });
  });
  socket.on("clientSubmitsMoveCommand", (data) => {
    const gameName = connectedSockets[socket.id].currentGameName;
    if (!gameRooms[gameName]) return;
    queueUpGameCommand({
      socket,
      connectedSockets,
      gameRooms,
      gameData: gameDatas[gameName],
      data,
      commandType: "orbMove",
    });
  });
  socket.on("selectAndMoveOrb", (data) => {
    const gameName = connectedSockets[socket.id].currentGameName;
    console.log(data.moveCommandData.newOrbHeadings)
    queueUpGameCommand({
      socket,
      connectedSockets,
      gameRooms,
      gameData: gameDatas[gameName],
      data,
      commandType: "orbSelectAndMove",
    });
  });
  // socket.on("clientRequestsGameData", () => {
  //   const gameName = connectedSockets[socket.id].currentGameName;
  //   socket.emit("serverSendsFullGameData", gameDatas[gameName])
  //   console.log("client requested re-send of full game data")
  // })
};

module.exports = battleRoomGameListeners;
