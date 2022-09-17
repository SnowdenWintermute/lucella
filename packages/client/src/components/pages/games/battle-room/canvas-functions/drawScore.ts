import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { inGameFontSizes } from "@lucella/common/battleRoomGame/consts";
import { WidthAndHeight } from "@lucella/common/battleRoomGame/types";

const drawScore = (context: CanvasRenderingContext2D, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) => {
  const fontSize = inGameFontSizes.large;
  const margin = 20;
  const { score, speedModifier } = currentGame;
  context.beginPath();
  context.fillStyle = "rgb(255,255,255)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${canvasSize.width / fontSize}px Arial`;
  context.fillText(
    `Points: ${score.host} / ${score.neededToWin} Speed: ${speedModifier}`,
    canvasSize.width / 2,
    margin
  );
  context.fillText(
    `Points: ${score.challenger} / ${score.neededToWin}  Speed: ${speedModifier}`,
    canvasSize.width / 2,
    canvasSize.height - margin
  );
};

export default drawScore;
