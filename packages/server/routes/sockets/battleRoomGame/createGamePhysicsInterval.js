const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs");
const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const processCommandInQueue = require("@lucella/common/battleRoomGame/processCommandInQueue")
const handleScoringPoints = require("./handleScoringPoints");
const removeCommandFromQueue = require("./removeCommandFromQueue");
const updateNumberOfLastCommandProcessed = require("./updateNumberOfLastCommandProcessed");

function createGamePhysicsInterval({
  io,
  connectedSockets,
  gameRooms,
  gameRoom,
  gameData,
  chatRooms,
}) {
  return setInterval(() => {
    if (!gameData) return;
    Object.keys(gameData.commandQueue).forEach((playerRole) => {
      Object.keys(gameData.commandQueue[playerRole]).forEach((commandInQueue) => {
        processCommandInQueue({ gameData, playerRole, commandInQueue: gameData.commandQueue[playerRole][commandInQueue] })
        updateNumberOfLastCommandProcessed({ gameData, playerRole, commandInQueue })
        removeCommandFromQueue({ gameData, playerRole, commandInQueue })
      }
      )
    })
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });
    handleScoringPoints({
      io,
      connectedSockets,
      gameRooms,
      gameRoom,
      gameData,
      chatRooms,
    });
    gameData.gameState.lastUpdateTimestamp = Date.now()
  }, 33);
}

module.exports = createGamePhysicsInterval;
