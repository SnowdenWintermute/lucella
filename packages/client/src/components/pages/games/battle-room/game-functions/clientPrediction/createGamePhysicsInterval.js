const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")
const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const clientPredictOwnOrbPositions = require("./clientPredictOwnOrbPositions");
const { syncGameState } = require("./syncGameState");
const { showOpponentOrbsInPast } = require("./showOpponentOrbsInPast");
const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone')
const removeCommandsAlreadyProcessedByServer = require('./removeCommandsAlreadyProcessedByServer')

function createGamePhysicsInterval({
  lastServerGameUpdate,
  numberOfLastServerUpdateApplied,
  gameData,
  commandQueue,
  playerRole,
  gameStateQueue,
}) {
  return setInterval(() => {
    if (!gameData || Object.keys(gameData).length < 1) return;

    const numberOfLastCommandUpdateFromServer =
      lastServerGameUpdate?.lastProcessedCommandNumbers ? lastServerGameUpdate.lastProcessedCommandNumbers[playerRole] : null
    console.log("numberOfLastCommandUpdateFromServer", numberOfLastCommandUpdateFromServer)

    // set gameState to last received state
    syncGameState({
      gameData,
      lastServerGameUpdate,
      numberOfLastServerUpdateApplied,
      numberOfLastCommandUpdateFromServer,
      playerRole,
    });
    removeCommandsAlreadyProcessedByServer(commandQueue, numberOfLastCommandUpdateFromServer)
    clientPredictOwnOrbPositions({ commandQueue, gameData, playerRole });
    showOpponentOrbsInPast({ gameStateQueue, gameData, playerRole });
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });
    handleOrbInEndzone(gameData);
  }, 33);
}

export default createGamePhysicsInterval;
