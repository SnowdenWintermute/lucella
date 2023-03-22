import { BattleRoomGame, inGameFontSizes, Point } from "../../../../../common";
import { INetworkPerformanceMetrics } from "../../../types";

export default function drawDebug(
  context: CanvasRenderingContext2D,
  game: BattleRoomGame,
  networkPerformanceMetrics: INetworkPerformanceMetrics,
  canvasDrawFractions: Point
) {
  const { mouseData } = game;

  if (mouseData.position && mouseData.position.x && mouseData.position.y) {
    context.beginPath();
    context.fillRect(mouseData.position.x * canvasDrawFractions.x - 3, mouseData.position.y * canvasDrawFractions.y - 3, 5, 5);
  }

  const itemsToShow = [
    // {
    //   name: "inputsToSimulate",
    //   value:
    //     game.debug.clientPrediction.inputsToSimulate && game.debug.clientPrediction.inputsToSimulate.map((item) => `${item.type} ${item.number}`).toString(),
    // },
    // {
    //   name: "lastProcessedClientInputNumber",
    //   value: game.debug.clientPrediction.lastProcessedClientInputNumber?.toString(),
    // },
    {
      name: "recent latencies",
      value: networkPerformanceMetrics.recentLatencies,
    },
    {
      name: "jitter",
      value: networkPerformanceMetrics.jitter,
    },
    {
      name: "min jitter",
      value: networkPerformanceMetrics.minJitter,
    },
    {
      name: "max jitter",
      value: networkPerformanceMetrics.maxJitter,
    },
    // {
    //   name: "frameTime",
    //   value: game.debug.clientPrediction.frameTime?.toString(),
    // },
  ];

  const marginLeft = 10;
  const spaceFromTop = 15;
  context.fillStyle = "rgba(0,0,0,.3)";
  context.beginPath();
  context.fillRect(0, 0, 480, itemsToShow.length * spaceFromTop + spaceFromTop);

  context.fillStyle = "white";
  context.textAlign = "left";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;

  itemsToShow.forEach((item, i) => {
    context.beginPath();
    context.fillText(`${item.name}: ${item.value}`, marginLeft, i * spaceFromTop + spaceFromTop);
  });
}
