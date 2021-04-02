import selectOrbs from "../game-functions/selectOrbs";

export default ({ commonEventHandlerProps }) => {
  const { socket, currentGameData, clientPlayer, playersInGame, mouseData, commandQueue } = commonEventHandlerProps
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