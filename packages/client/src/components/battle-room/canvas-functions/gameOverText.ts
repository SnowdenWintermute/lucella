import { BattleRoomGame, inGameFontSizes, Point, ThemeColors } from "../../../../../common";
import drawTextCenterScreen from "./drawTextCenterScreen";

const gameOverText = (context: CanvasRenderingContext2D, game: BattleRoomGame, canvasDrawFractions: Point, themeColors: ThemeColors) => {
  const fontSize = inGameFontSizes.medium * canvasDrawFractions.x;
  const marginBottom = 10 * canvasDrawFractions.y;
  drawTextCenterScreen(context, canvasDrawFractions, themeColors.LIGHT, marginBottom, fontSize, [
    `Winner: ${game.winner ? game.winner : "Game Over"}`,
    typeof game.gameOverCountdown.current === "number" ? `Score screen in ${game.gameOverCountdown.current}` || game.gameOverCountdown.duration.toString() : "",
  ]);
};

export default gameOverText;
