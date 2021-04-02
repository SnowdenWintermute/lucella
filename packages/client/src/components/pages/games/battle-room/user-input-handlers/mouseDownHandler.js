export default ({ e, mouseData }) => {
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = true;
    mouseData.leftPressedAtX = mouseData.xPos;
    mouseData.leftPressedAtY = mouseData.yPos;
  }
};