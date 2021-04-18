/* eslint-disable no-fallthrough */
const GameEventTypes = require('@lucella/common/battleRoomGame/consts/GameEventTypes')
const newOrbHeadings = require("./commandHandlers/newOrbHeadings");
const newOrbSelections = require("./commandHandlers/newOrbSelections");
const newOrbSelectionByKeypress = require("./commandHandlers/newOrbSelectionByKeypress");
const processEvent = require("@lucella/common/battleRoomGame/processEvent");

module.exports = ({ type, props, commonEventHandlerProps }) => {
  // create the event data
  // process event
  // emit event
  // queue event
  const { socket, eventQueue, numberOfLastCommandIssued, currentGameData, playerRole } = commonEventHandlerProps
  let eventData
  let newCommandNumber = null
  switch (type) {
    case GameEventTypes.ORB_MOVE:
      eventData = newOrbHeadings({ props, commonEventHandlerProps })
      break
    case GameEventTypes.ORB_SELECT:
      if (props.keyPressed) eventData = newOrbSelectionByKeypress({ keyPressed: props.keyPressed, commonEventHandlerProps })
      else eventData = newOrbSelections({ props, commonEventHandlerProps })
      break
    case GameEventTypes.ORB_COLLISION:
      eventData = props
      break
    default:
  }

  switch (type) {
    case GameEventTypes.ORB_MOVE:
    case GameEventTypes.ORB_SELECT:
      newCommandNumber = ++numberOfLastCommandIssued.current
      socket.emit("newCommand", { type, eventData, number: newCommandNumber });
      break
    default:
  }

  const event = {
    type,
    data: eventData,
    number: newCommandNumber,
    timestamp: Date.now()
  }

  processEvent({ gameData: currentGameData.current, playerRole, event })

  eventQueue.current.push(event);
}