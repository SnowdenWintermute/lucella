const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const processNewClientCommands = require("./processNewClientCommands");
const { syncGameState } = require("./syncGameState");
const { showOpponentOrbsInPast } = require("./showOpponentOrbsInPast");
const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone')
const removeCommandsAlreadyProcessedByServer = require('./removeCommandsAlreadyProcessedByServer')
const moveClientOrbsBasedOnNewCommands = require('./moveClientOrbsBasedOnNewCommands')
const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")

function createGamePhysicsInterval({
  lastServerGameUpdate,
  numberOfLastServerUpdateApplied,
  gameData,
  commandQueue,
  playerRole,
  gameStateQueue,
}) {
  return setInterval(() => {
    console.log("gameData: ", Object.keys(gameData).length)
    if (!gameData || Object.keys(gameData).length < 1) return;
    const numberOfLastCommandUpdateFromServer =
      lastServerGameUpdate?.lastProcessedCommandNumbers ? lastServerGameUpdate.lastProcessedCommandNumbers[playerRole] : null
    console.log("numberOfLastUpdateAppliedByServer: ", numberOfLastCommandUpdateFromServer)
    syncGameState({
      gameData,
      lastServerGameUpdate,
      numberOfLastServerUpdateApplied,
      numberOfLastCommandUpdateFromServer,
      playerRole,
    });
    // sync game to last known state
    // update any new orb headings
    // update orb pos based on time since last sync and headings
    removeCommandsAlreadyProcessedByServer(commandQueue, numberOfLastCommandUpdateFromServer)
    processNewClientCommands({ gameData, commandQueue, playerRole });
    moveClientOrbsBasedOnNewCommands({ gameData, commandQueue, playerRole })
    moveOrbs({ gameData });
    showOpponentOrbsInPast({ gameStateQueue, gameData, playerRole });
    handleOrbCollisions({ gameData });
    handleOrbInEndzone(gameData);
  }, 33);
}

export default createGamePhysicsInterval;
