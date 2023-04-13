import { BattleRoomGame, Point, ThemeColors } from "../../../../../common";

const gameOverText = (context: CanvasRenderingContext2D, game: BattleRoomGame, canvasDrawFractions: Point, themeColors: ThemeColors) => {
  const fontSize = 25;
  context.fillStyle = `rgb(${themeColors.LIGHT})`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${BattleRoomGame.baseWindowDimensions.width / fontSize}px 'DM Sans'`;
  context.beginPath();
  context.fillText(
    `Winner: ${game.winner ? game.winner : "Game Over"}`,
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2
  );
  context.fillText(
    typeof game.gameOverCountdown.current === "number" ? `Score screen in ${game.gameOverCountdown.current}` || game.gameOverCountdown.duration.toString() : "",
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2 + 20
  );
};

export default gameOverText;
