import { BattleRoomGame, inGameFontSizes, Point } from "../../../../common";

export default function drawDebug(context: CanvasRenderingContext2D, game: BattleRoomGame, canvasDrawFractions: Point) {
  const { mouseData } = game;

  mouseData.position &&
    context.fillRect(
      mouseData.position?.x * canvasDrawFractions.x - 3,
      mouseData.position?.y * canvasDrawFractions.y - 3,
      5,
      5
    );

  context.fillStyle = "white";
  context.textAlign = "left";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;
  context.fillText(
    game.debug.clientPrediction.inputsToSimulate.map((item) => item.type.slice(0, 1) + " ").toString(),
    10,
    10
  );
  context.fillText(game.debug.clientPrediction.ticksSinceLastClientTickConfirmedByServer.toString(), 10, 25);
  context.fillText(game.debug.clientPrediction.simulatingBetweenInputs.toString(), 10, 40);
  context.fillText(game.debug.clientPrediction.clientServerTickDifference.toString(), 10, 55);
}
