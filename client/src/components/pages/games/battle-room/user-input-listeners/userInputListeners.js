import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

import selectOrbs from "../game-functions.js/selectOrbs";
import orbMoveCommand from "../game-functions.js/orbMoveCommand";
import selectOrbAndIssueMoveCommand from "../game-functions.js/selectOrbAndIssueMoveCommand";

export const handleKeypress = ({
  e,
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
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
      playersInGame,
      keyPressed,
      mouseData,
    });
  }
  console.log("keydown " + e.keyCode);
};

export const mouseDownHandler = ({ e, mouseData }) => {
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = true;
    console.log(mouseData);
    mouseData.leftPressedAtX = e.nativeEvent.offsetX;
    mouseData.leftPressedAtY = e.nativeEvent.offsetY;
  }
};

export const mouseUpHandler = ({
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  e,
  mouseData,
}) => {
  console.log("mouseUp");
  if (e.button === 2) {
    mouseData.rightReleasedAtY = mouseData.yPos;
    mouseData.rightReleasedAtX = mouseData.xPos;
    orbMoveCommand({
      socket,
      currentGameData,
      clientPlayer,
      playersInGame,
      headingX: mouseData.rightReleasedAtX,
      headingY: mouseData.rightReleasedAtY,
    });
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAtX = e.nativeEvent.offsetX;
    mouseData.leftReleasedAtY = e.nativeEvent.offsetY;
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    selectOrbs({
      socket,
      currentGameData,
      playersInGame,
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
    mouseData.xPos = e.nativeEvent.offsetX;
    mouseData.yPos = e.nativeEvent.offsetY;
    console.log("mousemove");
  }
);

export const mouseLeaveHandler = ({
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  mouseData,
}) => {
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    selectOrbs({
      socket,
      currentGameData,
      playersInGame,
      clientPlayer,
      startX: leftPressedAtX,
      startY: leftPressedAtY,
      currX: xPos,
      currY: yPos,
    });
  }
};

export const mouseEnterHandler = ({ mouseData }) =>
  (mouseData.mouseOnScreen = true);
