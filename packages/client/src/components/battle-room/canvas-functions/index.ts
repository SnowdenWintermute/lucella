import { BattleRoomGame, COLORS, inGameFontSizes, ThemeColors, WidthAndHeight } from "../../../../../common";
import { drawOrbs } from "./drawOrbs";
import drawScore from "./drawScore";
import drawSelectionBox from "./drawSelectionBox";
import gameOverText from "./gameOverText";
import getSelectionBoxSize from "./getSelectionBoxSize";
import drawEndzones from "./drawEndzones";
import drawDebug from "./drawDebug";
import { INetworkPerformanceMetrics } from "../../../types";
import { Theme } from "../../../redux/slices/ui-slice";
import drawNewRoundStartingText from "./drawNewRoundStartingText";
import drawTextCenterScreen from "./drawTextCenterScreen";

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
    let THEME_COLORS: ThemeColors = COLORS.DEFAULT;
    if (theme === Theme.VT320) THEME_COLORS = COLORS.VT320;
    if (theme === Theme.HTML) THEME_COLORS = COLORS.HTML;
    if (theme === Theme.VIRGINIA_BLUEBELL) THEME_COLORS = COLORS.VIRGINIA_BLUEBELL;
    let isLightTheme;
    if (theme === Theme.HTML) isLightTheme = true;

    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawEndzones(context, game, canvasSize, THEME_COLORS);
    drawScore(context, canvasDrawFractions, game, canvasSize, THEME_COLORS);
    drawOrbs(context, playerRole, game, canvasDrawFractions, THEME_COLORS);
    if (game.debug.mode) drawDebug(context, game, networkPerformanceMetrics, canvasDrawFractions);
    if (game.winner) gameOverText(context, game, canvasDrawFractions, THEME_COLORS, isLightTheme);
    if (game.newRoundStarting) drawNewRoundStartingText(context, game, canvasDrawFractions, THEME_COLORS, isLightTheme);
    const selectionBoxSize = getSelectionBoxSize(game.mouseData, canvasDrawFractions);
    if (selectionBoxSize) drawSelectionBox(context, mouseData, canvasDrawFractions, selectionBoxSize, THEME_COLORS);

    if (!game.netcode.lastUpdateFromServer) {
      const fontSize = inGameFontSizes.large * canvasDrawFractions.x;
      drawTextCenterScreen(context, canvasDrawFractions, isLightTheme ? THEME_COLORS.DARK : THEME_COLORS.LIGHT, 0, fontSize, [`Loading...`]);
    }
  });
}
