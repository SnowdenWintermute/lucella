const moveOrbs = require("./moveOrbs");
const handleOrbCollisions = require("./handleOrbCollisions");
const setOrbHeadings = require("./setOrbHeadings");

function createGamePhysicsInterval({
  lastServerGameUpdate,
  gameData,
  commandQueue,
  playerRole,
}) {
  return setInterval(() => {
    // console.log(gameData);
    if (!gameData) return;
    if (Object.keys(gameData).length < 1) return;
    // console.log(commandQueue);
    // go through the command queue
    Object.keys(commandQueue).forEach((commandInQueue) => {
      if (!commandQueue[commandInQueue]) return;
      const { commandType } = commandQueue[commandInQueue];

      if (commandType === "orbSelect") {
        const { orbsToBeUpdated } = commandQueue[commandInQueue].data;

        gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb) => {
          orbsToBeUpdated.forEach((selectedOrb) => {
            if (selectedOrb.num === orb.num) {
              orb.isSelected = selectedOrb.isSelected;
            }
          });
        });
      }
      if (commandType === "orbMove") {
        setOrbHeadings({
          playerRole,
          gameData,
          data: commandQueue[commandInQueue].data,
        });
      }
      if (commandType === "orbSelectAndMove") {
        console.log("selectAndMove");
        // select first
        const { orbsToBeUpdated } = commandQueue[
          commandInQueue
        ].data.selectCommandData;

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
            data: commandQueue[commandInQueue].data.moveCommandData,
          });
        });
      }

      // update the most recently processed command number
      gameData.gameState.lastProcessedCommands =
        commandQueue[commandInQueue].data.commandPositionInQueue;
      // remove command from queue
      commandQueue.splice(
        commandQueue.indexOf(commandQueue[commandInQueue], 1)
      );
    });

    console.log(gameData);
    if (!gameData) return;
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });

    // reconcile if updates differ
  }, 33);
}

export default createGamePhysicsInterval;
