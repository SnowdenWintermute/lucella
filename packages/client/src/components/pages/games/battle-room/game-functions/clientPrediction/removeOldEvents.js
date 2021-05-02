module.exports = ({ eventQueue, numberOfLastCommandUpdateFromServer }) => {
  if (eventQueue.current.length <= 0) return
  let newEventQueue = []
  eventQueue.current.forEach(event => {
    console.log("event num: ", event.number, "numberOfLastCommandUpdateFromServer: ", numberOfLastCommandUpdateFromServer)
    if (!numberOfLastCommandUpdateFromServer || event.number > numberOfLastCommandUpdateFromServer)
      newEventQueue.push(event)
  })
  eventQueue.current = newEventQueue
}