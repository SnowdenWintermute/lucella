const processCommandInQueue = require("@lucella/common/battleRoomGame/processCommandInQueue")

module.exports = ({ eventQueue, gameData, playerRole }) => {
  eventQueue.queue.forEach((commandInQueue) => {
    processCommandInQueue({ gameData, playerRole, commandInQueue })
  })
}
