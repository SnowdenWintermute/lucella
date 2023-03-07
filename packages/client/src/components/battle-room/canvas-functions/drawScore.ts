import { BattleRoomGame, WidthAndHeight, inGameFontSizes, baseSpeedModifier } from "../../../../../common";

const drawScore = (context: CanvasRenderingContext2D, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) => {
  const fontSize = inGameFontSizes.large;
  const margin = 20;
  const { score, speedModifier } = currentGame;
  context.beginPath();
  context.fillStyle = "rgb(255,255,255)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${canvasSize.width / fontSize}px Arial`;
  const speedModifierAsPercentage = Math.round((+speedModifier.toFixed(2) / baseSpeedModifier) * 100);
  context.fillText(`Points: ${score.host} / ${score.neededToWin} Speed: ${speedModifierAsPercentage}%`, canvasSize.width / 2, margin);
  context.fillText(
    `Points: ${score.challenger} / ${score.neededToWin}  Speed: ${speedModifierAsPercentage}%`,
    canvasSize.width / 2,
    canvasSize.height - margin
  );
};

export default drawScore;
