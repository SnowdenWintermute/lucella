const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs");
const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const processCommandInQueue = require("@lucella/common/battleRoomGame/processCommandInQueue");
const handleScoringPoints = require("./handleScoringPoints");
const removeCommandFromQueue = require("./removeCommandFromQueue");
const updateNumberOfLastCommandProcessed = require("./updateNumberOfLastCommandProcessed");

function createGamePhysicsInterval({ application, gameName }) {
  const { gameDatas } = application;
  const gameData = gameDatas[gameName];
  return setInterval(() => {
    if (!gameData) return;
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
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });
    handleScoringPoints({ application, gameName });
    gameData.gameState.lastUpdateTimestamp = Date.now();
  }, 33);
}

module.exports = createGamePhysicsInterval;
