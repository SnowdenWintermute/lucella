import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

import selectOrbs from "../game-functions/selectOrbs";
import orbMoveCommand from "../game-functions/orbMoveCommand";
import selectOrbAndIssueMoveCommand from "../game-functions/selectOrbAndIssueMoveCommand";

export const touchStartHandler = ({
  e,
  mouseData,
  canvasInfo,
  currentGameData,
}) => {
  const rect = e.target.getBoundingClientRect();
  const offsetX = e.targetTouches[0].pageX - rect.left;
  const offsetY = e.targetTouches[0].pageY - rect.top;
  mouseData.touchStartX = mouseData.leftPressedAtX =
    (offsetX / canvasInfo.width) * currentGameData.width;
  mouseData.touchStartY = mouseData.leftPressedAtY =
    (offsetY / canvasInfo.height) * currentGameData.height;
  return Date.now();
};

export const touchEndHandler = ({
  e,
  canvasInfo,
  currentGameData,
  mouseData,
  socket,
  clientPlayer,
  playersInGame,
  commandQueue,
}) => {
  mouseData.leftCurrentlyPressed = false;
  const { touchStartX, touchStartY } = mouseData;

  const rect = e.target.getBoundingClientRect();
  const offsetX = e.changedTouches[0].pageX - rect.left;
  const offsetY = e.changedTouches[0].pageY - rect.top;

  const adjustedOffsetX = (offsetX / canvasInfo.width) * currentGameData.width;
  const adjustedOffsetY =
    (offsetY / canvasInfo.height) * currentGameData.height;

  mouseData.leftReleasedAtX = adjustedOffsetX;
  mouseData.leftReleasedAtY = adjustedOffsetY;

  const touchLength = Date.now() - mouseData.touchStartTime;
  if (
    touchLength > 500 ||
    Math.abs(adjustedOffsetX - touchStartX) > 8 ||
    Math.abs(adjustedOffsetY - touchStartY) > 8
  ) {
    // select
    selectOrbs({
      socket,
      currentGameData,
      playersInGame,
      clientPlayer,
      startX: touchStartX,
      startY: touchStartY,
      currX: mouseData.xPos,
      currY: mouseData.yPos,
      commandQueue,
    });
  } else {
    // move
    console.log("move");
    const data = orbMoveCommand({
      socket,
      currentGameData,
      clientPlayer,
      playersInGame,
      headingX: (offsetX / canvasInfo.width) * currentGameData.width,
      headingY: (offsetY / canvasInfo.height) * currentGameData.height,
      commandQueue,
    });
    socket.emit("clientSubmitsMoveCommand", data);
  }
};

export const touchMoveHandler = throttledEventHandlerCreator(
  33,
  ({ e, canvasInfo, currentGameData, mouseData }) => {
    const { touchStartX, touchStartY } = mouseData;
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.targetTouches[0].pageX - rect.left;
    const offsetY = e.targetTouches[0].pageY - rect.top;
    mouseData.xPos = (offsetX / canvasInfo.width) * currentGameData.width;
    mouseData.yPos = (offsetY / canvasInfo.height) * currentGameData.height;
    const touchLength = Date.now() - mouseData.touchStartTime;
    if (
      touchLength > 500 ||
      Math.abs(offsetX - touchStartX) > 8 ||
      Math.abs(offsetY - touchStartY) > 8
    ) {
      mouseData.leftCurrentlyPressed = true;
    }
  },
);

export const handleKeypress = throttledEventHandlerCreator(
  33,
  ({
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
  },
);

export const mouseDownHandler = ({ e, mouseData }) => {
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
    if (!canvasInfo) return;
    mouseData.xPos =
      (e.nativeEvent.offsetX / canvasInfo.width) * currentGameData.width;
    mouseData.yPos =
      (e.nativeEvent.offsetY / canvasInfo.height) * currentGameData.height;
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
