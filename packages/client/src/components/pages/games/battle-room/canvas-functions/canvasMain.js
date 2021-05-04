import drawOrbs from "./drawOrbs";
import drawScore from "./drawScore";
import gameOverText from "./gameOverText";
import getSelectionBoxSize from "./getSelectionBoxSize";

function draw({
  context,
  mouseData,
  clientPlayer,
  playerRole,
  currentGameData,
  canvasSize,
  gameOverCountdownText,
  gameStatus,
  winner,
  eventQueue,
  lastServerGameUpdate,
  numberOfUpdatesApplied
}) {
  return requestAnimationFrame(() => {
    if (!currentGameData) return;
    if (!currentGameData.gameState) return;
    if (Object.keys(currentGameData).length === 0) return;
    // clear it out
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const canvasXDrawFraction = canvasSize.width / currentGameData.width;
    const canvasYDrawFraction = canvasSize.height / currentGameData.height;

    // endzones
    let x = currentGameData.gameState.endzones.host.x;
    let y = currentGameData.gameState.endzones.host.y;
    let width = canvasSize.width;
    let height =
      (currentGameData.gameState.endzones.host.height /
        currentGameData.height) *
      canvasSize.height;
    context.beginPath();
    context.fillStyle = "rgb(50,50,70)";
    context.fillRect(x, y, width, height);
    x = currentGameData.gameState.endzones.challenger.x;
    y =
      (currentGameData.gameState.endzones.challenger.y /
        currentGameData.height) *
      canvasSize.height;
    width = canvasSize.width;
    height =
      (currentGameData.gameState.endzones.challenger.height /
        currentGameData.height) *
      canvasSize.height;
    context.beginPath();
    context.fillStyle = "rgb(50,70,50)";
    context.fillRect(x, y, width, height);

    drawScore({ context, clientPlayer, currentGameData, canvasSize });
    drawOrbs({ context, playerRole, currentGameData, canvasSize });
    gameOverText({
      context,
      currentGameData,
      gameStatus,
      winner,
      gameOverCountdownText,
      canvasXDrawFraction,
      canvasYDrawFraction,
    });

    // selection box
    if (mouseData.leftCurrentlyPressed) {
      if (!mouseData.mouseOnScreen) {
        mouseData.leftCurrentlyPressed = false;
      }
      const selectionBoxSize = getSelectionBoxSize({
        mouseData,
        canvasXDrawFraction,
        canvasYDrawFraction,
      });
      context.beginPath();
      context.strokeStyle = "rgb(103,191,104)";
      context.rect(
        mouseData.leftPressedAtX * canvasXDrawFraction,
        mouseData.leftPressedAtY * canvasYDrawFraction,
        selectionBoxSize.width,
        selectionBoxSize.height,
      );
      context.lineWidth = 3;
      context.stroke();
    }

  });
}

export default draw;
