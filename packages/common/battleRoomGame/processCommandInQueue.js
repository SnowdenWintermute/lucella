const handleOrbSelect = require("./commandHandlers/handleOrbSelect");
const setOrbHeadings = require("./setOrbHeadings");
const GameEventTypes = require('./consts/GameEventTypes')

module.exports = ({ gameData, commandInQueue, playerRole }) => {
  if (!commandInQueue) return;
  const { type } = commandInQueue
  switch (type) {
    case GameEventTypes.ORB_SELECT:
      handleOrbSelect({ gameData, orbsToBeUpdated: commandInQueue.data.orbsToBeUpdated, playerRole })
      break
    case GameEventTypes.ORB_MOVE:
      setOrbHeadings({
        gameData,
        newOrbHeadings: commandInQueue.data,
        playerRole,
      });
      break
    case GameEventTypes.ORB_SELECT_AND_MOVE:
      const { orbsToBeUpdated } = commandInQueue.data.selectCommandData;
      handleOrbSelect({ gameData, orbsToBeUpdated, playerRole })
      setOrbHeadings({
        gameData,
        newOrbHeadings: commandInQueue.data.moveCommandData,
        playerRole,
      });
      break;
    default:
  }
}