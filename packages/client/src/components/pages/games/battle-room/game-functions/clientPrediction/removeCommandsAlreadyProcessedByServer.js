module.exports = (eventQueue, numberOfLastCommandUpdateFromServer) => {
  eventQueue.queue.forEach((command, i) => {
    if (command.number <=
      numberOfLastCommandUpdateFromServer) eventQueue.queue.splice(i, 1);
  })
}