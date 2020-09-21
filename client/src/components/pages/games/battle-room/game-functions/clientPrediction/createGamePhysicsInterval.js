import cloneDeep from "lodash.clonedeep";
const moveOrbs = require("./moveOrbs");
const handleOrbCollisions = require("./handleOrbCollisions");
const handleScoringPoints = require("./handleScoringPoints");
const setOrbHeadings = require("./setOrbHeadings");

function createGamePhysicsInterval({
  lastServerGameUpdate,
  numberOfLastServerUpdateApplied,
  gameData,
  commandQueue,
  playerRole,
}) {
  return setInterval(() => {
    // console.log(commandQueue);
    if (!gameData) return;
    if (Object.keys(gameData).length < 1) return;
    // console.log(commandQueue);
    const numberOfLastCommandUpdateFromServer = lastServerGameUpdate.gameState
      ? lastServerGameUpdate.gameState.lastProcessedCommands[playerRole]
      : null;
    // set gameState to last recieved state
    if (lastServerGameUpdate.gameState) {
      if (
        !numberOfLastServerUpdateApplied ||
        numberOfLastServerUpdateApplied !== numberOfLastCommandUpdateFromServer
      ) {
        console.log(numberOfLastServerUpdateApplied);
        Object.keys(lastServerGameUpdate.gameState).forEach((key) => {
          if (lastServerGameUpdate.gameState[key] !== gameData.gameState[key])
            gameData.gameState[key] = cloneDeep(
              lastServerGameUpdate.gameState[key],
            );
        });
        numberOfLastServerUpdateApplied = numberOfLastCommandUpdateFromServer;
      }
    }

    // find command to discard
    const commandToDiscard = commandQueue.queue.find((commandInQueue) => {
      return (
        commandInQueue.data.commandPositionInQueue ===
        numberOfLastCommandUpdateFromServer
      );
    });
    // discard corresponding command in client's queue
    commandQueue.queue.splice(commandQueue.queue.indexOf(commandToDiscard));

    // go through the client command queue and predict game state
    commandQueue.queue.forEach((commandInQueue) => {
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
    });
    if (!gameData) return;
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });
    handleScoringPoints({ gameData });
  }, 33);
}

export default createGamePhysicsInterval;
