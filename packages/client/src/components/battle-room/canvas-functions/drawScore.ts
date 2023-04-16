import { BattleRoomGame, WidthAndHeight, inGameFontSizes, baseSpeedModifier, Point, ThemeColors } from "../../../../../common";

const drawScore = (
  context: CanvasRenderingContext2D,
  canvasDrawFractions: Point,
  currentGame: BattleRoomGame,
  canvasSize: WidthAndHeight,
  themeColors: ThemeColors
) => {
  const fontSize = inGameFontSizes.large / canvasDrawFractions.x;
  const margin = (currentGame.endzones.challenger.height / 2) * canvasDrawFractions.y;
  const { score, speedModifier, roundsWon, numberOfRoundsNeededToWin } = currentGame;
  const speedModifierAsPercentage = Math.round((+speedModifier.toFixed(2) / baseSpeedModifier) * 100);

  context.fillStyle = `rgb(${themeColors.LIGHT})`;
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = `bold ${canvasSize.width / fontSize}px 'DM Sans'`;
  context.beginPath();

  const hostSpeedText = `Speed: ${speedModifierAsPercentage}%`;
  const hostSpeedTextWidth = context.measureText(hostSpeedText);
  context.fillText(`Score: ${score.host}/${score.neededToWin} [${roundsWon.host}/${numberOfRoundsNeededToWin}]`, margin, margin);
  context.fillText(`Speed: ${speedModifierAsPercentage}%`, canvasSize.width - hostSpeedTextWidth.width - margin, margin);
  // Speed: ${speedModifierAsPercentage}%`, canvasSize.width / 2, margin
  const challengerScoreText = `Score: ${score.challenger}/${score.neededToWin} (${roundsWon.challenger}/${numberOfRoundsNeededToWin})`;
  const challengerScoreWidth = context.measureText(challengerScoreText);
  context.fillText(challengerScoreText, canvasSize.width - challengerScoreWidth.width - margin, canvasSize.height - margin);
  context.fillText(`Speed: ${speedModifierAsPercentage}%`, margin, canvasSize.height - margin);
  // Speed: ${speedModifierAsPercentage}%`,
  //   canvasSize.width / 2,
  //   canvasSize.height - margin
};

export default drawScore;
