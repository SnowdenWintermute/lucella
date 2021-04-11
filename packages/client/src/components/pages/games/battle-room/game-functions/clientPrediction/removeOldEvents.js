module.exports = ({ eventQueue, numberOfLastCommandUpdateFromServer }) => {
  eventQueue.current.forEach((event, i) => {
    if (event.number <= numberOfLastCommandUpdateFromServer) eventQueue.current.splice(0, i);
  })
}