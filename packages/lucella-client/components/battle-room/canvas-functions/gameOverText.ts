import { BattleRoomGame } from "../../../../common/src/classes/BattleRoomGame";
import { Point } from "../../../../common/src/classes/Point";

const gameOverText = (context: CanvasRenderingContext2D, currentGame: BattleRoomGame, canvasDrawFractions: Point) => {
  const fontSize = 25;
  context.beginPath();
  context.fillStyle = "rgb(255,255,255)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${BattleRoomGame.baseWindowDimensions.width / fontSize}px Arial`;
  context.fillText(
    `Winner: ${currentGame.winner ? currentGame.winner : "..."}`,
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2
  );
  context.fillText(
    "Score screen in " + currentGame.gameOverCountdown.current,
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2 + 20
  );
};

export default gameOverText;
