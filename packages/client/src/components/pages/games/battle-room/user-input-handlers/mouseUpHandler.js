import selectOrbs from "../game-functions/selectOrbs";
import orbMoveCommand from "../game-functions/orbMoveCommand";

export default ({ e, commonEventHandlerProps }) => {
  const { socket, currentGameData, clientPlayer, playersInGame, mouseData, commandQueue } = commonEventHandlerProps
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