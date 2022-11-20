import { BattleRoomGame, GameRoom, GameStatus, WidthAndHeight } from "../../../../common";
import { drawOrbs } from "./drawOrbs";
import drawScore from "./drawScore";
import drawSelectionBox from "./drawSelectionBox";
import gameOverText from "./gameOverText";
import getSelectionBoxSize from "./getSelectionBoxSize";
import drawEndzones from "./drawEndzones";
import drawDebug from "./drawDebug";

export default function draw(context: CanvasRenderingContext2D, canvasSize: WidthAndHeight, playerRole: any, game: BattleRoomGame) {
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
    if (game.debug.showDebug) drawDebug(context, game, canvasDrawFractions);
    if (game.winner) gameOverText(context, game, canvasDrawFractions);
    const selectionBoxSize = getSelectionBoxSize(game.mouseData, canvasDrawFractions);
    if (selectionBoxSize) drawSelectionBox(context, mouseData, canvasDrawFractions, selectionBoxSize);
  });
}
