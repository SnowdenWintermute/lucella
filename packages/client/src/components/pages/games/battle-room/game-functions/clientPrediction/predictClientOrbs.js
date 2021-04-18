const GameEventTypes = require("@lucella/common/battleRoomGame/consts/GameEventTypes")
const setOrbHeadings = require("@lucella/common/battleRoomGame/setOrbHeadings")
const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs")
const processEvent = require("@lucella/common/battleRoomGame/processEvent");

module.exports = ({ gameData, eventQueue, playerRole, lastServerGameUpdate }) => {
  if (!eventQueue.current) return
  if (eventQueue.current.length < 1) return
  let lastEventTimestamp = lastServerGameUpdate.timestamp
  console.log("lastEventTimestamp ", lastEventTimestamp)
  // console.log("gameData.gameState.lastUpdateTimestamp " + gameData.gameState.lastUpdateTimestamp)
  eventQueue.current.forEach(event => {
    processEvent({ gameData, playerRole, event })
    console.log("event.timestamp ", event.timestamp)
    const deltaT = lastEventTimestamp - event.timestamp
    console.log("deltaT: " + deltaT)
    moveOrbs({ gameData, deltaT: deltaT > 0 ? deltaT : 0 })
    lastEventTimestamp = event.timestamp
  })
};