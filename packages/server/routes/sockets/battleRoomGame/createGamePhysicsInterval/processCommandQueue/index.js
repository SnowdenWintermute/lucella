const processCommandInQueue = require("@lucella/common/battleRoomGame/processCommandInQueue");
const removeCommandFromQueue = require("./removeCommandFromQueue");
const updateNumberOfLastCommandProcessed = require("./updateNumberOfLastCommandProcessed");

module.exports = ({ gameData }) => {
  Object.keys(gameData.commandQueue).forEach((playerRole) => {
    Object.keys(gameData.commandQueue[playerRole]).forEach(
      (commandInQueue) => {
        processCommandInQueue({
          gameData,
          playerRole,
          commandInQueue: gameData.commandQueue[playerRole][commandInQueue],
        });
        updateNumberOfLastCommandProcessed({
          gameData,
          playerRole,
          commandInQueue,
        });
        removeCommandFromQueue({ gameData, playerRole, commandInQueue });
      }
    );
  });
}