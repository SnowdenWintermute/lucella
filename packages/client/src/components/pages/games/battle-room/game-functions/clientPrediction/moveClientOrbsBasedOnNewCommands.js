const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")

module.exports = ({ gameData, commandQueue }) => {
  commandQueue.queue.forEach((command, i) => {
    const nextCommand = commandQueue.queue[i + 1]
    let nextCommandTimeAdded = null
    if (nextCommand) nextCommandTimeAdded = nextCommand.timeAdded
    const deltaT = nextCommandTimeAdded ? nextCommandTimeAdded - command.timeAdded : Date.now() - command.timeAdded
    console.log("command.timeAdded: ", command.timeAdded)
    console.log("nextCommandTimeAdded: ", nextCommandTimeAdded)
    moveOrbs({ gameData, deltaT });
  })
}