const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const processNewClientCommands = require("./clientPrediction/processNewClientCommands");
const syncClientOrbs = require("./clientPrediction/syncClientOrbs");
const { showOpponentOrbsInPast } = require("./clientPrediction/showOpponentOrbsInPast");
const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone')
const removeCommandsAlreadyProcessedByServer = require('./clientPrediction/removeCommandsAlreadyProcessedByServer')
const moveClientOrbsBasedOnNewCommands = require('./clientPrediction/moveClientOrbsBasedOnNewCommands')
const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")
const syncText = require('./syncText')

export default ({
  currentDrawFunction,
  lastServerGameUpdate,
  numberOfLastUpdateApplied,
  gameData,
  eventQueue,
  numberOfLastCommandIssued,
  playerRole,
  gameStateQueue,
}) => {
  return setInterval(() => {
    if (!gameData || Object.keys(gameData).length < 1) return;
    const numberOfLastCommandUpdateFromServer =
      lastServerGameUpdate.lastProcessedCommandNumbers ? lastServerGameUpdate.lastProcessedCommandNumbers[playerRole] : null
    if (!eventQueue[0] || numberOfLastCommandUpdateFromServer > eventQueue[0].number) {
      // removeOldCommandsAndEvents({gameData, eventQueue})
      syncClientOrbs({ gameData, lastServerGameUpdate, playerRole });
      //    calculate client orb positions based on time the most recently processed server command was issued by client,
      //    plus all commands and collision events not yet processed.
      // predictClientOrbs({gameData, eventQueue, playerRole})
      // queueOpponentOrbMovements({}) // add opponent orb movements to a queue for interpolating them 
      numberOfLastUpdateApplied.current = numberOfLastCommandUpdateFromServer;
    }
    // Always:
    syncText({ gameData, lastServerGameUpdate, playerRole })
    // interpolate opponent orbs between 2nd to last and last known locations
    // move all client orbs toward headings
    // detect collisions and add them to event queue
    // draw
    console.log("numberOfLastUpdateAppliedByServer: ", numberOfLastCommandUpdateFromServer)
    // sync game to last known state
    // update any new orb headings
    // update orb pos based on time since last sync and headings
    removeCommandsAlreadyProcessedByServer(eventQueue, numberOfLastCommandUpdateFromServer)
    processNewClientCommands({ gameData, eventQueue, playerRole });
    moveClientOrbsBasedOnNewCommands({ gameData, eventQueue, playerRole })
    moveOrbs({ gameData });
    showOpponentOrbsInPast({ gameStateQueue, gameData, playerRole });
    handleOrbCollisions({ gameData });
    handleOrbInEndzone(gameData);
    currentDrawFunction()
  }, 33);
}
