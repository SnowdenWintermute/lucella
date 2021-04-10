const handleAndQueueNewGameEvent = require("../game-functions/handleAndQueueNewGameEvent");
const GameEventTypes = require('@lucella/common/battleRoomGame/consts/GameEventTypes')

export default ({ e, commonEventHandlerProps }) => {
  const { canvasSize, currentGameData, mouseData, } = commonEventHandlerProps
  mouseData.leftCurrentlyPressed = false;
  const { touchStartX, touchStartY } = mouseData;

  const rect = e.target.getBoundingClientRect();
  const offsetX = e.changedTouches[0].pageX - rect.left;
  const offsetY = e.changedTouches[0].pageY - rect.top;

  const adjustedOffsetX = (offsetX / canvasSize.width) * currentGameData.width;
  const adjustedOffsetY =
    (offsetY / canvasSize.height) * currentGameData.height;

  mouseData.leftReleasedAtX = adjustedOffsetX;
  mouseData.leftReleasedAtY = adjustedOffsetY;

  const touchLength = Date.now() - mouseData.touchStartTime;
  let type, props
  if (
    touchLength > 500 ||
    Math.abs(adjustedOffsetX - touchStartX) > 8 ||
    Math.abs(adjustedOffsetY - touchStartY) > 8
  ) {
    type = GameEventTypes.ORB_SELECT
    props = {
      startX: touchStartX,
      startY: touchStartY,
      currX: mouseData.xPos,
      currY: mouseData.yPos,
    }
  } else {
    type = GameEventTypes.ORB_MOVE
    props = {
      headingX: (offsetX / canvasSize.width) * currentGameData.width,
      headingY: (offsetY / canvasSize.height) * currentGameData.height,
    }
  }

  handleAndQueueNewGameEvent({
    type,
    props,
    commonEventHandlerProps
  })
};