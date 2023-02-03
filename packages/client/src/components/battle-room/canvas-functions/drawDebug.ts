import { BattleRoomGame, inGameFontSizes, Point } from "../../../../../common";

export default function drawDebug(context: CanvasRenderingContext2D, game: BattleRoomGame, latency: number | undefined, canvasDrawFractions: Point) {
  const { mouseData } = game;

  if (mouseData.position && mouseData.position.x && mouseData.position.y)
    context.fillRect(mouseData.position.x * canvasDrawFractions.x - 3, mouseData.position.y * canvasDrawFractions.y - 3, 5, 5);

  const itemsToShow = [
    {
      name: "inputsToSimulate",
      value:
        game.debug.clientPrediction.inputsToSimulate && game.debug.clientPrediction.inputsToSimulate.map((item) => `${item.type} ${item.number}`).toString(),
    },
    {
      name: "lastProcessedClientInputNumber",
      value: game.debug.clientPrediction.lastProcessedClientInputNumber?.toString(),
    },
    {
      name: "latency",
      value: latency?.toString(),
    },
    {
      name: "frameTime",
      value: game.debug.clientPrediction.frameTime?.toString(),
    },
  ];

  const marginLeft = 10;
  const spaceFromTop = 15;
  context.fillStyle = "rgba(0,0,0,.3)";
  context.fillRect(0, 0, 480, itemsToShow.length * spaceFromTop + spaceFromTop);

  context.fillStyle = "white";
  context.textAlign = "left";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;

  itemsToShow.forEach((item, i) => {
    context.fillText(`${item.name}: ${item.value}`, marginLeft, i * spaceFromTop + spaceFromTop);
  });
}
