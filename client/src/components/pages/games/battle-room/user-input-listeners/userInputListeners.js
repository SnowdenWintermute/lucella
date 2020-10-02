import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

import selectOrbs from "../game-functions/selectOrbs";
import orbMoveCommand from "../game-functions/orbMoveCommand";
import selectOrbAndIssueMoveCommand from "../game-functions/selectOrbAndIssueMoveCommand";

export const handleKeypress = throttledEventHandlerCreator(
  33,
  ({
    e,
    socket,
    currentGameData,
    canvasInfo,
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
  },
);

export const mouseDownHandler = ({
  e,
  mouseData,
  currentGameData,
  canvasInfo,
}) => {
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = true;
    mouseData.leftPressedAtX = mouseData.xPos;
    mouseData.leftPressedAtY = mouseData.yPos;
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
    mouseData.leftReleasedAtX = mouseData.xPos;
    mouseData.leftReleasedAtY = mouseData.yPos;
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
  ({ e, mouseData, currentGameData, canvasInfo }) => {
    mouseData.xPos =
      (e.nativeEvent.offsetX / canvasInfo.width) * currentGameData.width;
    mouseData.yPos =
      (e.nativeEvent.offsetY / canvasInfo.height) * currentGameData.height;

    console.log(mouseData.xPos);
    console.log(mouseData.yPos);
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
