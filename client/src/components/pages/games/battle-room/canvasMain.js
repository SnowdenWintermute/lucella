import drawOrbs from "./canvas-functions/drawOrbs";
import drawScore from "./canvas-functions/drawScore";
import gameOverText from "./canvas-functions/gameOverText";
import getSelectionBoxSize from "./canvas-functions/getSelectionBoxSize";

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
    let { x, y, width, height } = currentGameData.endzones.host;
    context.beginPath();
    context.fillStyle = "rgb(50,50,70)";
    context.fillRect(x, y, width, height);
    x = currentGameData.endzones.challenger.x;
    y = currentGameData.endzones.challenger.y;
    width = currentGameData.endzones.challenger.width;
    height = currentGameData.endzones.challenger.height;
    context.beginPath();
    context.fillStyle = "rgb(50,70,50)";
    context.fillRect(x, y, width, height);

    drawScore({ context, clientPlayer, currentGameData });
    drawOrbs({ context, clientPlayer, currentGameData });
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
      console.log("drawing selection box");
      context.beginPath();
      context.strokeStyle = "rgb(103,191,104)";
      context.rect(
        mouseData.leftPressedAtX,
        mouseData.leftPressedAtY,
        selectionBoxSize.width,
        selectionBoxSize.height
      );
      context.lineWidth = 3;
      context.stroke();
    }
  });
}

export default draw;
