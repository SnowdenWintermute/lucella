const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs")
const processEvent = require("@lucella/common/battleRoomGame/processEvent");

module.exports = ({ gameData, eventQueue, playerRole }) => {
  if (!eventQueue.current || eventQueue.current.length < 1) return
  eventQueue.current.forEach((event, i) => {
    processEvent({ gameData, playerRole, event })
    let deltaT
    if (eventQueue.current[i + 1]) deltaT = eventQueue.current[i + 1].timestamp - event.timestamp
    else deltaT = Date.now() - event.timestamp
    moveOrbs({ gameData, deltaT })
  })
};