import { BattleRoomGame } from "../../../../common/src/classes/BattleRoomGame";
import { WidthAndHeight } from "../../../../common/src/types";
import { GameStatus } from "../../../../common/src/enums";
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
  currentGame: BattleRoomGame,
  gameStatus: string
) {
  return requestAnimationFrame(() => {
    if (!currentGame) return;
    const { mouseData } = currentGame;
    const canvasDrawFractions = {
      x: canvasSize.width / BattleRoomGame.baseWindowDimensions.width,
      y: canvasSize.height / BattleRoomGame.baseWindowDimensions.height,
    };

    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawEndzones(context, currentGame, canvasSize);
    drawScore(context, currentGame, canvasSize);
    drawOrbs(context, playerRole, currentGame, canvasDrawFractions);
    if (gameStatus === GameStatus.ENDING) gameOverText(context, currentGame, canvasDrawFractions);
    const selectionBoxSize = getSelectionBoxSize(currentGame.mouseData, canvasDrawFractions);
    if (selectionBoxSize) drawSelectionBox(context, mouseData, canvasDrawFractions, selectionBoxSize);
  });
}
