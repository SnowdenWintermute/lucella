import selectOrbs from "../game-functions/selectOrbs/selectOrbs";
import orbMoveCommand from "../game-functions/orbMoveCommand";

export default ({ e, commonEventHandlerProps }) => {
  const { mouseData } = commonEventHandlerProps
  if (e.button === 2) {
    mouseData.rightReleasedAtY = mouseData.yPos;
    mouseData.rightReleasedAtX = mouseData.xPos;
    orbMoveCommand({
      headingX: mouseData.rightReleasedAtX,
      headingY: mouseData.rightReleasedAtY,
      commonEventHandlerProps
    });
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAtX = mouseData.xPos;
    mouseData.leftReleasedAtY = mouseData.yPos;
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    selectOrbs({
      startX: leftPressedAtX,
      startY: leftPressedAtY,
      currX: xPos,
      currY: yPos,
      commonEventHandlerProps
    });
  }
};