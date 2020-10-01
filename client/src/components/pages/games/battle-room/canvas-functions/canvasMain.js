import drawOrbs from "./drawOrbs";
import drawScore from "./drawScore";
import gameOverText from "./gameOverText";
import getSelectionBoxSize from "./getSelectionBoxSize";

function draw({
  context,
  mouseData,
  clientPlayer,
  currentGameData,
  canvasInfo,
  gameOverCountdownText,
  gameStatus,
  winner,
}) {
  return requestAnimationFrame(() => {
    if (!currentGameData) return;
    if (Object.keys(currentGameData).length === 0) return;
    // clear it out
    context.clearRect(0, 0, canvasInfo.width, canvasInfo.height);

    // endzones
    let x = currentGameData.gameState.endzones.host.x;
    let y = currentGameData.gameState.endzones.host.y;
    let width = canvasInfo.width;
    let height =
      (currentGameData.gameState.endzones.host.height /
        currentGameData.height) *
      canvasInfo.height;
    context.beginPath();
    context.fillStyle = "rgb(50,50,70)";
    context.fillRect(x, y, width, height);
    x = currentGameData.gameState.endzones.challenger.x;
    y =
      (currentGameData.gameState.endzones.challenger.y /
        currentGameData.height) *
      canvasInfo.height;
    width = canvasInfo.width;
    height =
      (currentGameData.gameState.endzones.challenger.height /
        currentGameData.height) *
      canvasInfo.height;
    context.beginPath();
    context.fillStyle = "rgb(50,70,50)";
    context.fillRect(x, y, width, height);

    drawScore({ context, clientPlayer, currentGameData, canvasInfo });
    drawOrbs({ context, clientPlayer, currentGameData, canvasInfo });
    gameOverText({
      context,
      currentGameData,
      gameStatus,
      winner,
      gameOverCountdownText,
    });

    // selection box
    if (mouseData.leftCurrentlyPressed) {
      if (!mouseData.mouseOnScreen) {
        mouseData.leftCurrentlyPressed = false;
      }
      const selectionBoxSize = getSelectionBoxSize({ mouseData });
      context.beginPath();
      context.strokeStyle = "rgb(103,191,104)";
      context.rect(
        mouseData.leftPressedAtX,
        mouseData.leftPressedAtY,
        selectionBoxSize.width,
        selectionBoxSize.height,
      );
      context.lineWidth = 3;
      context.stroke();
    }
  });
}

export default draw;
