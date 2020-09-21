import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

import selectOrbs from "../game-functions/selectOrbs";
import orbMoveCommand from "../game-functions/orbMoveCommand";
import selectOrbAndIssueMoveCommand from "../game-functions/selectOrbAndIssueMoveCommand";

export const handleKeypress = ({
  e,
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  mouseData,
  commandQueue,
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
  if (keyPressed > 0 && keyPressed < 6) {
    selectOrbAndIssueMoveCommand({
      socket,
      currentGameData,
      clientPlayer,
      playersInGame,
      keyPressed,
      mouseData,
      commandQueue,
    });
  }
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
  playersInGame,
  e,
  mouseData,
  commandQueue,
}) => {
  if (e.button === 2) {
    mouseData.rightReleasedAtY = mouseData.yPos;
    mouseData.rightReleasedAtX = mouseData.xPos;
    const data = orbMoveCommand({
      socket,
      currentGameData,
      clientPlayer,
      playersInGame,
      headingX: mouseData.rightReleasedAtX,
      headingY: mouseData.rightReleasedAtY,
      commandQueue,
    });
    socket.emit("clientSubmitsMoveCommand", data);
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
      commandQueue,
    });
  }
};

export const mouseMoveHandler = throttledEventHandlerCreator(
  33,
  ({ e, mouseData }) => {
    mouseData.xPos = e.nativeEvent.offsetX;
    mouseData.yPos = e.nativeEvent.offsetY;
  },
);

export const mouseLeaveHandler = ({
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  mouseData,
  commandQueue,
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
      commandQueue,
    });
  }
};

export const mouseEnterHandler = ({ mouseData }) =>
  (mouseData.mouseOnScreen = true);
