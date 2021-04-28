const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const syncClientOrbs = require("./clientPrediction/syncClientOrbs");
const { showOpponentOrbsInPast } = require("./clientPrediction/showOpponentOrbsInPast");
const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone')
const removeOldEvents = require('./clientPrediction/removeOldEvents')
const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")
const syncText = require('./syncText')
const predictClientOrbs = require('./clientPrediction/predictClientOrbs')

export default ({
  currentDrawFunction,
  lastServerGameUpdate,
  numberOfLastUpdateApplied,
  gameData,
  eventQueue,
  playerRole,
  gameStateQueue,
  commonEventHandlerProps,
  numberOfUpdatesApplied
}) => {
  let lastClientGameLoopUpdate = Date.now()
  return setInterval(() => {
    if (!lastServerGameUpdate) return
    if (!gameData.current || Object.keys(gameData.current).length < 1) return;
    const numberOfLastCommandUpdateFromServer = lastServerGameUpdate?.lastProcessedCommandNumbers && lastServerGameUpdate.lastProcessedCommandNumbers[playerRole]
    syncClientOrbs({ gameData, lastServerGameUpdate, playerRole });
    if (numberOfLastCommandUpdateFromServer > numberOfLastUpdateApplied.current) {
      removeOldEvents({ eventQueue, numberOfLastCommandUpdateFromServer })
      if (eventQueue.current.length > 0) {
        console.log("Predicting orbs, numberOfLastCommandUpdateFromServer: ", numberOfLastCommandUpdateFromServer, eventQueue.current[0].number)
        predictClientOrbs({ gameData: gameData.current, eventQueue, playerRole, lastServerGameUpdate, numberOfLastCommandUpdateFromServer })
      }
      numberOfUpdatesApplied.current++
      numberOfLastUpdateApplied.current = numberOfLastCommandUpdateFromServer;
    } else {
      const deltaT = Date.now() - lastClientGameLoopUpdate.lastUpdateTimestamp
      moveOrbs({ gameData: gameData.current, deltaT })
    }
    // queueOpponentOrbMovements({}) // add opponent orb movements to a queue for interpolating them 
    // Always:
    // syncText({ gameData: gameData.current, lastServerGameUpdate, playerRole })
    // interpolate opponent orbs between 2nd to last and last known locations
    // move all client orbs toward headings
    // detect collisions and add them to event queue
    // draw
    // sync game to last known state
    // update any new orb headings
    // update orb pos based on time since last sync and headings
    const deltaT = Date.now() - lastClientGameLoopUpdate
    moveOrbs({ gameData: gameData.current, deltaT });
    // showOpponentOrbsInPast({ gameStateQueue, gameData: gameData.current, playerRole });
    // handleOrbCollisions({ gameData: gameData.current, handleAndQueueNewGameEvent, commonEventHandlerProps });
    // handleOrbInEndzone(gameData.current);
    currentDrawFunction()
    lastClientGameLoopUpdate = Date.now()
  }, 33);
}
