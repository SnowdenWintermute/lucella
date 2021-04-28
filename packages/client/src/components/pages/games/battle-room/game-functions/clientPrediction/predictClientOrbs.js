const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs")
const processEvent = require("@lucella/common/battleRoomGame/processEvent");

module.exports = ({ gameData, eventQueue, playerRole, lastServerGameUpdate }) => {
  if (!eventQueue.current || eventQueue.current.length < 1) return
  let lastEventTimestamp
  eventQueue.current.forEach((event, i) => {
    processEvent({ gameData, playerRole, event })
    let deltaT
    if (!lastEventTimestamp) deltaT = Date.now() - lastServerGameUpdate.lastUpdateTimestamp
    else deltaT = event.timestamp - lastEventTimestamp
    console.log("event " + i + " prediction deltaT: ", deltaT)
    moveOrbs({ gameData, deltaT })
    lastEventTimestamp = event.timestamp
  })
};