import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

import selectOrbs from "../game-functions.js/selectOrbs";
import orbMoveCommand from "../game-functions.js/orbMoveCommand";
import selectOrbAndIssueMoveCommand from "../game-functions.js/selectOrbAndIssueMoveCommand";

export const handleKeypress = ({
  e,
  socket,
  currentGameData,
  clientPlayer,
  mouseData,
}) => {
  let keyPressed;
  switch (e.keyCode) {
    case 49: // 1
      keyPressed = 1;
      break;
    case 50: // 2
      keyPressed = 2;
      break;
    case 51: // 3
      keyPressed = 3;
      break;
    case 52: // 4
      keyPressed = 4;
      break;
    case 53: // 5
      keyPressed = 5;
      break;
    default:
      return;
  }
  console.log(keyPressed);
  if (keyPressed > 0 && keyPressed < 6) {
    selectOrbAndIssueMoveCommand({
      socket,
      currentGameData,
      clientPlayer,
      keyPressed,
      mouseData,
    });
  }
  console.log("keydown " + e.keyCode);
};

export const mouseDownHandler = ({ e, mouseData }) => {
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = true;
    mouseData.leftPressedAtX = e.nativeEvent.offsetX;
    mouseData.leftPressedAtY = e.nativeEvent.offsetY;
  }
};

export const mouseUpHandler = ({
  socket,
  currentGameData,
  clientPlayer,
  e,
  mouseData,
}) => {
  if (e.button === 2) {
    mouseData.rightReleasedAtY = mouseData.yPos;
    mouseData.rightReleasedAtX = mouseData.xPos;
    orbMoveCommand({
      socket,
      currentGameData,
      clientPlayer,
      headingX: mouseData.rightReleasedAtX,
      headingY: mouseData.rightReleasedAtY,
    });
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAtX = e.offsetX;
    mouseData.leftReleasedAtY = e.offsetY;
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    selectOrbs({
      socket,
      currentGameData,
      clientPlayer,
      startX: leftPressedAtX,
      startY: leftPressedAtY,
      currX: xPos,
      currY: yPos,
    });
  }
};

export const mouseMoveHandler = throttledEventHandlerCreator(
  33,
  ({ e, mouseData }) => {
    if (!mouseData.leftCurrentlyPressed) return;
    mouseData.xPos = e.offsetX;
    mouseData.yPos = e.offsetY;
    console.log("mousemove");
  }
);
