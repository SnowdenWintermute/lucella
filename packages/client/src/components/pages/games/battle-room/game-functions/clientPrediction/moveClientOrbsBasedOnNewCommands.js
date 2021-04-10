const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")

module.exports = ({ gameData, eventQueue }) => {
  eventQueue.queue.forEach((command, i) => {
    const nextCommand = eventQueue.queue[i + 1]
    let nextCommandAddedTime = null
    if (nextCommand) nextCommandAddedTime = nextCommand.timeAdded
    const deltaT = nextCommandAddedTime ? nextCommandAddedTime - command.timeAdded : null
    if (deltaT) moveOrbs({ gameData, deltaT });
  })
}