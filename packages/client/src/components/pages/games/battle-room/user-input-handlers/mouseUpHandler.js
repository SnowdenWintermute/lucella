const handleAndQueueNewGameEvent = require("../game-functions/handleAndQueueNewGameEvent");
const GameEventTypes = require('@lucella/common/battleRoomGame/consts/GameEventTypes')

export default ({ e, commonEventHandlerProps }) => {
  const { mouseData } = commonEventHandlerProps
  let type, props
  if (e.button === 2) {
    mouseData.rightReleasedAtY = mouseData.yPos;
    mouseData.rightReleasedAtX = mouseData.xPos;
    type = GameEventTypes.ORB_MOVE
    props = {
      headingX: mouseData.rightReleasedAtX,
      headingY: mouseData.rightReleasedAtY,
    }
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAtX = mouseData.xPos;
    mouseData.leftReleasedAtY = mouseData.yPos;
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    type = GameEventTypes.ORB_SELECT
    props = {
      headingX: mouseData.rightReleasedAtX,
      headingY: mouseData.rightReleasedAtY,
      startX: leftPressedAtX,
      startY: leftPressedAtY,
      currX: xPos,
      currY: yPos,
    }
  }
  if (e.button === 0 || e.button === 2) handleAndQueueNewGameEvent({ type, props, commonEventHandlerProps })
};