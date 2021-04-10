const processCommandInQueue = require("@lucella/common/battleRoomGame/processCommandInQueue")

module.exports = ({ eventQueue, gameData, playerRole }) => {
  eventQueue.queue.forEach((commandInQueue) => {
    console.log(commandInQueue)
    processCommandInQueue({ gameData, playerRole, commandInQueue })
  })
}
