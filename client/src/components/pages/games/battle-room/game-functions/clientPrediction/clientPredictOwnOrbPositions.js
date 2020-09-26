const setOrbHeadings = require("./setOrbHeadings");

function clientPredictOwnOrbPositions({ commandQueue, gameData, playerRole }) {
  // go through the client command queue and predict game state for client's orbs
  commandQueue.queue.forEach((commandInQueue) => {
    console.log("commandInQueue");
    const { commandType } = commandInQueue;
    // select orb
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
    // move
    if (commandType === "orbMove") {
      setOrbHeadings({
        playerRole,
        gameData,
        data: commandInQueue.data,
      });
    }
    // select and move
    if (commandType === "selectAndMoveOrb") {
      console.log("selectAndMoveOrb");
      // select first
      const { orbsToBeUpdated } = commandInQueue.data.selectCommandData;

      gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb) => {
        orbsToBeUpdated.forEach((selectedOrb) => {
          if (selectedOrb.num === orb.num) {
            orb.isSelected = selectedOrb.isSelected;
          }
        });
        // then set heading
        setOrbHeadings({
          playerRole,
          gameData,
          data: commandInQueue.data.moveCommandData,
        });
      });
    }
  });
}

module.exports = clientPredictOwnOrbPositions;
