import { BattleRoomGame, GameRoom, GameStatus, WidthAndHeight } from "../../../../common";
import { drawOrbs } from "./drawOrbs";
import drawScore from "./drawScore";
import drawSelectionBox from "./drawSelectionBox";
import gameOverText from "./gameOverText";
import getSelectionBoxSize from "./getSelectionBoxSize";
import drawEndzones from "./drawEndzones";

export default function draw(
  context: CanvasRenderingContext2D,
  canvasSize: WidthAndHeight,
  playerRole: any,
  game: BattleRoomGame,
  gameRoom: GameRoom
) {
  return requestAnimationFrame(() => {
    if (!game) return;
    const { mouseData } = game;
    const canvasDrawFractions = {
      x: canvasSize.width / BattleRoomGame.baseWindowDimensions.width,
      y: canvasSize.height / BattleRoomGame.baseWindowDimensions.height,
    };

    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawEndzones(context, game, canvasSize);
    drawScore(context, game, canvasSize);
    drawOrbs(context, playerRole, game, canvasDrawFractions);

    context.fillStyle = "white";
    context.textAlign = "left";
    context.fillText(
      game.clientPrediction.inputsToSimulate
        .map((item) => item.input.type.slice(0, 3) + " " + item.input.numberOfTicksToSimulate)
        .toString(),
      10,
      10
    );
    context.fillText(game.clientPrediction.ticksSinceLastConfirmedProcessedInput.toString(), 10, 25);
    context.fillText(game.clientPrediction.simulatingBetweenInputs.toString(), 10, 40);
    context.fillText(game.clientPrediction.clientServerTickDifference.toString(), 10, 55);

    if (gameRoom.gameStatus === GameStatus.ENDING) gameOverText(context, game, gameRoom, canvasDrawFractions);
    const selectionBoxSize = getSelectionBoxSize(game.mouseData, canvasDrawFractions);
    if (selectionBoxSize) drawSelectionBox(context, mouseData, canvasDrawFractions, selectionBoxSize);
  });
}
