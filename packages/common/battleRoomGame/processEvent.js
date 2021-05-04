const handleOrbSelect = require("./commandHandlers/handleOrbSelect");
const setOrbHeadings = require("./setOrbHeadings");
const GameEventTypes = require('./consts/GameEventTypes');
const handleOrbInEndzone = require("./handleOrbInEndzone");

module.exports = ({ gameData, event, playerRole }) => {
  if (!event) return;
  const { type } = event
  switch (type) {
    case GameEventTypes.ORB_SELECT:
      handleOrbSelect({ gameData, orbsToBeUpdated: event.data.orbsToBeUpdated, playerRole })
      break
    case GameEventTypes.ORB_MOVE:
      setOrbHeadings({
        gameData,
        newOrbHeadings: event.data,
        playerRole,
      });
      break
    case GameEventTypes.ORB_COLLISION:
      handleOrbCollisions({ gameData })
      break;
    case GameEventTypes.ORB_ENTERS_ENDZONE:
      handleOrbInEndzone({ gameData })
      break;
    default:
  }
  gameData.gameState.lastCommandProcessedAt = Date.now()
}