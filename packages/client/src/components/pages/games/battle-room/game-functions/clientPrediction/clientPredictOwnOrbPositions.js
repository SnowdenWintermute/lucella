const processCommandInQueue = require("@lucella/common/battleRoomGame/processCommandInQueue")

module.exports = ({ commandQueue, gameData, playerRole }) => {
  commandQueue.queue.forEach((commandInQueue) => {
    console.log(commandQueue)
    console.log(commandInQueue)
    processCommandInQueue({ gameData, playerRole, commandInQueue })
  })
}
