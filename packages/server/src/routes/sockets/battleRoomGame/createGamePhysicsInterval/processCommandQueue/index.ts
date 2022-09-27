const processEvent = require("../common/src/processEvent");
const removeCommandFromQueue = require("./removeCommandFromQueue");
const updateNumberOfLastCommandProcessed = require("./updateNumberOfLastCommandProcessed");

module.exports = ({ gameData }) => {
  Object.keys(gameData.commandQueue).forEach((playerRole) => {
    gameData.commandQueue[playerRole].forEach((commandInQueue, i) => {
      processEvent({ gameData, playerRole, event: commandInQueue });
      updateNumberOfLastCommandProcessed({ gameData, playerRole, i });
      removeCommandFromQueue({ gameData, playerRole, i });
    });
  });
};
