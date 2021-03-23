const handleOrbSelect = require("./commandHandlers/handleOrbSelect");
const setOrbHeadings = require("./setOrbHeadings");

module.exports = ({ gameData, commandInQueue, playerRole }) => {
  if (!commandInQueue) return;
  const { commandType } = commandInQueue
  switch (commandType) {
    case "orbSelect":
      handleOrbSelect({ gameData, orbsToBeUpdated: commandInQueue.data.orbsToBeUpdated, playerRole })
      break
    case "orbMove":
      setOrbHeadings({
        gameData,
        data: commandInQueue.data,
        playerRole,
      });
      break
    case "orbSelectAndMove":
      const { orbsToBeUpdated } = commandInQueue.data.selectCommandData;
      handleOrbSelect({ gameData, orbsToBeUpdated, playerRole })
      setOrbHeadings({
        gameData,
        data: commandInQueue.data.moveCommandData,
        playerRole,
      });
      break;
    default:
  }
}