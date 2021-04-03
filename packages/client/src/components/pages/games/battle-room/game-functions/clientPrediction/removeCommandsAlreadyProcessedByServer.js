module.exports = (commandQueue, numberOfLastCommandUpdateFromServer) => {
  commandQueue.queue.forEach((command, i) => {
    if (command.data.commandPositionInQueue <=
      numberOfLastCommandUpdateFromServer) commandQueue.queue.splice(i, 1);
  })
}