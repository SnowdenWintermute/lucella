module.exports = ({ eventQueue, numberOfLastCommandUpdateFromServer }) => {
  let newEventQueue = []
  eventQueue.current.forEach(event => {
    if (event.number > numberOfLastCommandUpdateFromServer)
      newEventQueue.push(event)
  })
  eventQueue.current = newEventQueue
}