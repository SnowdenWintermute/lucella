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
    // console.log(commandQueue);
    if (!gameData) return;
    if (Object.keys(gameData).length < 1) return;
    // console.log(commandQueue);
    // go through the command queue
    commandQueue.queue.forEach((commandInQueue) => {
      console.log(commandInQueue);
      // if (commandInQueue) return;
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
      if (commandType === "orbMove") {
        setOrbHeadings({
          playerRole,
          gameData,
          data: commandInQueue.data,
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
            data: commandInQueue.data.moveCommandData,
          });
        });
      }

      // update the most recently processed command number
      gameData.gameState.lastProcessedCommands =
        commandInQueue.data.commandPositionInQueue;
      // remove command from queue
      commandQueue.queue.splice(commandQueue.queue.indexOf(commandInQueue));
    });
    if (!gameData) return;
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });

    // reconcile if updates differ
  }, 33);
}

export default createGamePhysicsInterval;
