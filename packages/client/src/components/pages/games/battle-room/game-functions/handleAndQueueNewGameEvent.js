/* eslint-disable no-fallthrough */
const GameEventTypes = require('@lucella/common/battleRoomGame/consts/GameEventTypes')
const setAndReturnNewOrbHeadings = require("./commandHandlers/setAndReturnNewOrbHeadings");
const setAndReturnNewOrbSelections = require("./commandHandlers/setAndReturnNewOrbSelections");
const setAndReturnNewOrbSelectionByKeypress = require("./commandHandlers/setAndReturnNewOrbSelectionByKeypress");

module.exports = ({ type, props, commonEventHandlerProps }) => {
  const { socket, eventQueue, numberOfLastCommandIssued } = commonEventHandlerProps
  let eventData
  let newCommandNumber = null
  switch (type) {
    case GameEventTypes.ORB_MOVE:
      eventData = setAndReturnNewOrbHeadings({ props, commonEventHandlerProps })
      break
    case GameEventTypes.ORB_SELECT:
      eventData = setAndReturnNewOrbSelections({ props, commonEventHandlerProps })
      break
    case GameEventTypes.ORB_SELECT_AND_MOVE:
      const selectCommandData = setAndReturnNewOrbSelectionByKeypress({ keyPressed: props.keyPressed, commonEventHandlerProps })
      const moveCommandData = setAndReturnNewOrbHeadings({ props, commonEventHandlerProps })
      eventData = { moveCommandData, selectCommandData }
      break
    case GameEventTypes.ORB_COLLISION:
      eventData = props
      break
    default:
  }

  switch (type) {
    case GameEventTypes.ORB_MOVE:
    case GameEventTypes.ORB_SELECT:
    case GameEventTypes.ORB_SELECT_AND_MOVE:
      newCommandNumber = ++numberOfLastCommandIssued.current
      socket.emit("newCommand", { type, eventData, number: newCommandNumber });
      break
    default:
  }

  eventQueue.queue.push({
    type,
    data: eventData,
    number: newCommandNumber,
    timeAdded: Date.now()
  });
}