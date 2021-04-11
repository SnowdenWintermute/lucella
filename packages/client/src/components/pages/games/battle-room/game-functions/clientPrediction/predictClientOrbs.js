const GameEventTypes = require("@lucella/common/battleRoomGame/consts/GameEventTypes")
const setOrbHeadings = require("@lucella/common/battleRoomGame/setOrbHeadings")
const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs")

module.exports = ({ gameData, eventQueue, playerRole }) => {
  if (!eventQueue.current) return
  const clientOrbs = gameData.gameState.orbs[playerRole]
  let lastEventTimestamp = gameData.gameState.lastUpdateTimestamp
  console.log(clientOrbs[0])
  console.log(eventQueue.current)
  eventQueue.current.forEach(event => {
    const deltaT = event.timestamp - lastEventTimestamp
    switch (event.type) {
      case GameEventTypes.ORB_MOVE:
        setOrbHeadings({ gameData, playerRole, newOrbHeadings: event.data })
        moveOrbs({ gameData, deltaT })
        break
      case GameEventTypes.ORB_SELECT:
      case GameEventTypes.ORB_SELECT_AND_MOVE:
      case GameEventTypes.ORB_COLLISION:
      default:
    }
    lastEventTimestamp = event.timestamp
  })
}