const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const processNewClientCommands = require("./clientPrediction/processNewClientCommands");
const { syncGameState } = require("./clientPrediction/syncGameState");
const { showOpponentOrbsInPast } = require("./clientPrediction/showOpponentOrbsInPast");
const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone')
const removeCommandsAlreadyProcessedByServer = require('./clientPrediction/removeCommandsAlreadyProcessedByServer')
const moveClientOrbsBasedOnNewCommands = require('./clientPrediction/moveClientOrbsBasedOnNewCommands')
const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")

export default ({
  currentDrawFunction,
  lastServerGameUpdate,
  numberOfLastUpdateReceived,
  numberOfLastUpdateApplied,
  gameData,
  commandQueue,
  playerRole,
  gameStateQueue,
}) => {
  return setInterval(() => {
    if (!gameData || Object.keys(gameData).length < 1) return;
    if (numberOfLastUpdateReceived.current !== numberOfLastUpdateApplied.current) {
      // sync client orbs to server positions, then
      //    calculate client orb positions based on time the most recently processed server command was issued by client,
      //    plus all commands and collision events not yet processed.
      //    increment numberOfLastUpdateReceived.
      // add opponent orb movements to a queue for interpolating them 
      // removeOldCommandsAndEvents({gameData, eventQueue})
      // syncClientOrbs({gameData, decodedPacket, playerRole })
      // predictClientOrbs({gameData, eventQueue, playerRole})
      // queueOpponentOrbMovements({})
    }
    // Always:
    // interpolate opponent orbs between 2nd to last and last known locations
    // move all client orbs toward headings
    // detect collisions and add them to event queue
    // draw
    const numberOfLastCommandUpdateFromServer =
      lastServerGameUpdate?.lastProcessedCommandNumbers ? lastServerGameUpdate.lastProcessedCommandNumbers[playerRole] : null
    console.log("numberOfLastUpdateAppliedByServer: ", numberOfLastCommandUpdateFromServer)
    syncGameState({
      gameData,
      lastServerGameUpdate,
      numberOfLastUpdateReceived,
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
    currentDrawFunction()
  }, 33);
}
