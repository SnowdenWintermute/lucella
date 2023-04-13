import { BattleRoomGame, COLORS, ThemeColors, WidthAndHeight } from "../../../../../common";
import { drawOrbs } from "./drawOrbs";
import drawScore from "./drawScore";
import drawSelectionBox from "./drawSelectionBox";
import gameOverText from "./gameOverText";
import getSelectionBoxSize from "./getSelectionBoxSize";
import drawEndzones from "./drawEndzones";
import drawDebug from "./drawDebug";
import { INetworkPerformanceMetrics } from "../../../types";
import { Theme } from "../../../redux/slices/ui-slice";

export default function draw(
  context: CanvasRenderingContext2D,
  canvasSize: WidthAndHeight,
  playerRole: any,
  game: BattleRoomGame,
  networkPerformanceMetrics: INetworkPerformanceMetrics,
  theme?: Theme
) {
  return requestAnimationFrame(() => {
    if (!game) return;
    const { mouseData } = game;
    const canvasDrawFractions = {
      x: canvasSize.width / BattleRoomGame.baseWindowDimensions.width,
      y: canvasSize.height / BattleRoomGame.baseWindowDimensions.height,
    };
    const THEME_COLORS: ThemeColors = {
      LIGHT: theme === Theme.VT320 ? COLORS.VT320.LIGHT : COLORS.DEFAULT.LIGHT,
      DARK: theme === Theme.VT320 ? COLORS.VT320.DARK : COLORS.DEFAULT.DARK,
      SELECTION: theme === Theme.VT320 ? COLORS.VT320.SELECTION : COLORS.DEFAULT.SELECTION,
    };

    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawEndzones(context, game, canvasSize, THEME_COLORS);
    drawScore(context, canvasDrawFractions, game, canvasSize, THEME_COLORS);
    drawOrbs(context, playerRole, game, canvasDrawFractions, THEME_COLORS);
    if (game.debug.mode) drawDebug(context, game, networkPerformanceMetrics, canvasDrawFractions);
    if (game.winner) gameOverText(context, game, canvasDrawFractions, THEME_COLORS);
    const selectionBoxSize = getSelectionBoxSize(game.mouseData, canvasDrawFractions);
    if (selectionBoxSize) drawSelectionBox(context, mouseData, canvasDrawFractions, selectionBoxSize, THEME_COLORS);

    if (!game.netcode.lastUpdateFromServer) {
      const fontSize = 25;
      context.fillStyle = `rgb(${THEME_COLORS.LIGHT})`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `bold ${BattleRoomGame.baseWindowDimensions.width / fontSize}px 'DM Sans'`;
      context.beginPath();
      context.fillText(
        `Loading...`,
        (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
        (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2
      );
    }
  });
}
