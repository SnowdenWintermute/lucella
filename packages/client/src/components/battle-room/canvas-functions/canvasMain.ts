import { BattleRoomGame, WidthAndHeight } from "../../../../../common";
import { drawOrbs } from "./drawOrbs";
import drawScore from "./drawScore";
import drawSelectionBox from "./drawSelectionBox";
import gameOverText from "./gameOverText";
import getSelectionBoxSize from "./getSelectionBoxSize";
import drawEndzones from "./drawEndzones";
import drawDebug from "./drawDebug";

export default function draw(
  context: CanvasRenderingContext2D,
  canvasSize: WidthAndHeight,
  playerRole: any,
  game: BattleRoomGame,
  latency: number | undefined
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
    if (game.debug.mode) drawDebug(context, game, latency, canvasDrawFractions);
    if (game.winner) gameOverText(context, game, canvasDrawFractions);
    const selectionBoxSize = getSelectionBoxSize(game.mouseData, canvasDrawFractions);
    if (selectionBoxSize) drawSelectionBox(context, mouseData, canvasDrawFractions, selectionBoxSize);

    if (!game.netcode.lastUpdateFromServer) {
      const fontSize = 25;
      context.beginPath();
      context.fillStyle = "rgb(255,255,255)";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `bold ${BattleRoomGame.baseWindowDimensions.width / fontSize}px Arial`;
      context.fillText(
        `Loading...`,
        (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
        (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2
      );
    }
  });
}
