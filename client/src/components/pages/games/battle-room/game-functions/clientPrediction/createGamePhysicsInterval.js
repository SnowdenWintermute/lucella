import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
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
  gameDataQueue,
}) {
  return setInterval(() => {
    if (!gameData) return;
    if (Object.keys(gameData).length < 1) return;
    // console.log(commandQueue);
    const numberOfLastCommandUpdateFromServer = lastServerGameUpdate.gameState
      ? lastServerGameUpdate.gameState.lastProcessedCommands[playerRole]
      : null;
    const opponentOrbsRole =
      playerRole === "host" ? "challengerOrbs" : "hostOrbs";
    // set gameState to last recieved state
    if (lastServerGameUpdate.gameState) {
      if (
        !numberOfLastServerUpdateApplied ||
        numberOfLastServerUpdateApplied !== numberOfLastCommandUpdateFromServer
      ) {
        Object.keys(lastServerGameUpdate.gameState).forEach((key) => {
          if (
            !isEqual(
              lastServerGameUpdate.gameState[key],
              gameData.gameState[key],
            )
          ) {
            if (key === "orbs") {
              gameData.gameState.orbs[playerRole + "Orbs"] = cloneDeep(
                lastServerGameUpdate.gameState.orbs[playerRole + "Orbs"],
              );
            } else {
              gameData.gameState[key] = cloneDeep(
                lastServerGameUpdate.gameState[key],
              );
            }
          }
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

    // go through the client command queue and predict game state for client's orbs
    commandQueue.queue.forEach((commandInQueue) => {
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
    // go through gameData queue and show opponent positions in the past
    if (Object.keys(gameDataQueue).length > 1) {
      console.log(gameDataQueue);
      if (
        gameDataQueue[gameDataQueue.length - 2].gameState &&
        gameData.gameState
      ) {
        gameData.gameState.orbs[opponentOrbsRole] =
          gameDataQueue[gameDataQueue.length - 2].gameState.orbs[
            opponentOrbsRole
          ];
      }
      gameDataQueue.shift();
    }

    if (!gameData) return;
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });
    handleScoringPoints({ gameData });
  }, 33);
}

export default createGamePhysicsInterval;
