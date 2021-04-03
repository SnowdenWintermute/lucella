import selectOrbs from "../game-functions/selectOrbs/selectOrbs";

export default ({ commonEventHandlerProps }) => {
  const { mouseData, } = commonEventHandlerProps
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
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