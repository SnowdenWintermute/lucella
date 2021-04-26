const GameEventTypes = require("@lucella/common/battleRoomGame/consts/GameEventTypes")
const setOrbHeadings = require("@lucella/common/battleRoomGame/setOrbHeadings")
const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs")
const processEvent = require("@lucella/common/battleRoomGame/processEvent");

module.exports = ({ gameData, eventQueue, playerRole, lastServerGameUpdate }) => {
  if (!eventQueue.current) return
  if (eventQueue.current.length < 1) return
  let lastEventTimestamp = lastServerGameUpdate.lastCommandProcessedAt
  eventQueue.current.forEach((event, i) => {
    processEvent({ gameData, playerRole, event })
    console.log("prediction from event ", i)
    const deltaT = event.timestamp - lastEventTimestamp
    moveOrbs({ gameData, deltaT })
    lastEventTimestamp = event.timestamp
  })
};