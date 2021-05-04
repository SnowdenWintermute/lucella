// const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions/index.js");
// const syncClientOrbs = require("./clientPrediction/syncClientOrbs");
// const { showOpponentOrbsInPast } = require("./clientPrediction/showOpponentOrbsInPast");
// const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone')
// const removeOldEvents = require('./clientPrediction/removeOldEvents')
// const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")
// const syncText = require('./syncText')
// const predictClientOrbs = require('./clientPrediction/predictClientOrbs')
// const handleAndQueueNewGameEvent = require('./handleAndQueueNewGameEvent')

export default ({
  currentDrawFunction,
  lastServerGameUpdate,
  // numberOfLastUpdateApplied,
  gameData,
  // eventQueue,
  // playerRole,
  // gameStateQueue,
  // commonEventHandlerProps,
  // numberOfUpdatesApplied
}) => {
  // let lastClientGameLoopUpdate = Date.now()
  return setInterval(() => {
    if (!lastServerGameUpdate) return
    if (!gameData.current || Object.keys(gameData.current).length < 1) return;
    // const numberOfLastCommandUpdateFromServer = lastServerGameUpdate?.lastProcessedCommandNumbers && lastServerGameUpdate.lastProcessedCommandNumbers[playerRole]
    // console.log("numberOfLastCommandUpdateFromServer: ", numberOfLastCommandUpdateFromServer, "numberOfLastUpdateApplied.current: ", numberOfLastUpdateApplied.current)
    gameData.current.gameState = lastServerGameUpdate
    // syncClientOrbs({ gameData, lastServerGameUpdate, playerRole });
    // if (numberOfLastCommandUpdateFromServer > numberOfLastUpdateApplied.current) {
    //   removeOldEvents({ eventQueue, numberOfLastCommandUpdateFromServer })
    //   if (eventQueue.current.length > 0)
    //     predictClientOrbs({ gameData: gameData.current, eventQueue, playerRole, lastServerGameUpdate, numberOfLastCommandUpdateFromServer })
    //   numberOfUpdatesApplied.current++
    //   numberOfLastUpdateApplied.current = numberOfLastCommandUpdateFromServer;
    // }
    // // queueOpponentOrbMovements({}) // add opponent orb movements to a queue for interpolating them 
    // // Always:
    // // syncText({ gameData: gameData.current, lastServerGameUpdate, playerRole })
    // // interpolate opponent orbs between 2nd to last and last known locations
    // // detect collisions and add them to event queue
    // // draw
    // const deltaT = Date.now() - lastClientGameLoopUpdate
    // moveOrbs({ gameData: gameData.current, deltaT });
    // // showOpponentOrbsInPast({ gameStateQueue, gameData: gameData.current, playerRole });
    // handleOrbCollisions({ gameData: gameData.current, handleAndQueueNewGameEvent, commonEventHandlerProps });
    // handleOrbInEndzone({ gameData: gameData.current, handleAndQueueNewGameEvent });
    currentDrawFunction()
    // lastClientGameLoopUpdate = Date.now();
  }, 33);
}
