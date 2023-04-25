import { BattleRoomGame, WidthAndHeight, inGameFontSizes, Point, ThemeColors } from "../../../../../common";

const drawScore = (
  context: CanvasRenderingContext2D,
  canvasDrawFractions: Point,
  currentGame: BattleRoomGame,
  canvasSize: WidthAndHeight,
  themeColors: ThemeColors
) => {
  const fontSize = inGameFontSizes.medium * canvasDrawFractions.x;
  const margin = (currentGame.endzones.challenger.height / 2) * canvasDrawFractions.y;
  const { score, speedModifier, roundsWon, config } = currentGame;
  const { numberOfRoundsRequiredToWin } = config;
  const speedModifierAsPercentage = Math.round(+speedModifier.toFixed(2) * 100);

  context.fillStyle = `rgb(${themeColors.LIGHT})`;
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = `bold ${fontSize}px 'DM Sans'`;
  context.beginPath();

  const hostSpeedText = `Speed: ${speedModifierAsPercentage}%`;
  const hostSpeedTextWidth = context.measureText(hostSpeedText);
  context.fillText(`Score: ${score.host}/${score.neededToWin} [${roundsWon.host}/${numberOfRoundsRequiredToWin}]`, margin, margin);
  context.fillText(`Speed: ${speedModifierAsPercentage}%`, canvasSize.width - hostSpeedTextWidth.width - margin, margin);

  const challengerScoreText = `Score: ${score.challenger}/${score.neededToWin} [${roundsWon.challenger}/${numberOfRoundsRequiredToWin}]`;
  const challengerScoreWidth = context.measureText(challengerScoreText);
  context.fillText(challengerScoreText, canvasSize.width - challengerScoreWidth.width - margin, canvasSize.height - margin);
  context.fillText(`Speed: ${speedModifierAsPercentage}%`, margin, canvasSize.height - margin);
};

export default drawScore;
