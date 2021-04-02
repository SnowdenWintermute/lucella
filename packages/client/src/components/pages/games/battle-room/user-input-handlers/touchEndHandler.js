import selectOrbs from "../game-functions/selectOrbs";
import orbMoveCommand from "../game-functions/orbMoveCommand";

export default ({ e, commonEventHandlerProps }) => {
  const { canvasInfo, currentGameData, mouseData, socket, clientPlayer, playersInGame, commandQueue } = commonEventHandlerProps
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