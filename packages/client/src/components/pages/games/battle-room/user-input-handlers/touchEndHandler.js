import selectOrbs from "../game-functions/selectOrbs/selectOrbs";
import orbMoveCommand from "../game-functions/orbMoveCommand";

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
  if (
    touchLength > 500 ||
    Math.abs(adjustedOffsetX - touchStartX) > 8 ||
    Math.abs(adjustedOffsetY - touchStartY) > 8
  ) {
    selectOrbs({
      startX: touchStartX,
      startY: touchStartY,
      currX: mouseData.xPos,
      currY: mouseData.yPos,
      commonEventHandlerProps
    });
  } else
    orbMoveCommand({
      headingX: (offsetX / canvasSize.width) * currentGameData.width,
      headingY: (offsetY / canvasSize.height) * currentGameData.height,
      commonEventHandlerProps
    });
};