const setOrbHeadings = require("@lucella/common/battleRoomGame/setOrbHeadings");

module.exports = ({ gameData, commandInQueue, playerRole }) => {
  if (!gameData.commandQueue[playerRole][commandInQueue]) return;
  const { commandType } = commandInQueue;

  if (commandType === "orbSelect") {
    const { orbsToBeUpdated } = commandInQueue.data;
    gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb) => {
      orbsToBeUpdated.forEach((selectedOrb) => {
        if (selectedOrb.num === orb.num) {
          orb.isSelected = selectedOrb.isSelected;
        }
      });
    });
  }

  if (commandType === "orbMove")
    setOrbHeadings({
      playerRole,
      gameData,
      data: commandInQueue.data,
    });

  if (commandType === "selectAndMoveOrb") {
    const { orbsToBeUpdated } = commandInQueue.data.selectCommandData;
    gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb) => {
      orbsToBeUpdated.forEach((selectedOrb) => {
        if (selectedOrb.num === orb.num) orb.isSelected = selectedOrb.isSelected;
      });
      setOrbHeadings({
        playerRole,
        gameData,
        data: commandInQueue.data.moveCommandData,
      });
    });
  }
}