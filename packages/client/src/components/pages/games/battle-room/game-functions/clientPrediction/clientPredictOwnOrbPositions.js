const processCommandInQueue = require("@lucella/common/battleRoomGame/processCommandInQueue")

module.exports = ({ commandQueue, gameData, playerRole }) => {
  console.log(commandQueue.queue)
  commandQueue.queue.forEach((commandInQueue) => {
    console.log(commandInQueue)
    processCommandInQueue({ gameData, playerRole, commandInQueue })
  })
}
