import { BattleRoomGame, GameRoom, Point } from "../../../../common";

const gameOverText = (context: CanvasRenderingContext2D, game: BattleRoomGame, gameRoom: GameRoom, canvasDrawFractions: Point) => {
  const fontSize = 25;
  context.beginPath();
  context.fillStyle = "rgb(255,255,255)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${BattleRoomGame.baseWindowDimensions.width / fontSize}px Arial`;
  context.fillText(
    `Winner: ${gameRoom.winner ? gameRoom.winner : "Game Over"}`,
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2
  );
  context.fillText(
    typeof game.gameOverCountdown.current === "number" ? "Score screen in " + game.gameOverCountdown.current : game.gameOverCountdown.duration.toString(),
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2 + 20
  );
};

export default gameOverText;
