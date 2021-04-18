module.exports = ({ eventQueue, numberOfLastCommandUpdateFromServer }) => {
  let newEventQueue = []
  console.log("numberOfLastCommandUpdateFromServer ", numberOfLastCommandUpdateFromServer)
  console.log("removing events", eventQueue.current)
  eventQueue.current.forEach(event => {
    if (event.number > numberOfLastCommandUpdateFromServer)
      newEventQueue.push(event)
  })
  eventQueue.current = newEventQueue
  console.log("afyter removed events", eventQueue.current)

}