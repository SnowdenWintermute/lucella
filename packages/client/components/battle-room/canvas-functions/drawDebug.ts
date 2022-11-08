import { BattleRoomGame, inGameFontSizes, Point } from "../../../../common";

export default function drawDebug(context: CanvasRenderingContext2D, game: BattleRoomGame, canvasDrawFractions: Point) {
  const { mouseData } = game;

  mouseData.position && context.fillRect(mouseData.position?.x * canvasDrawFractions.x - 3, mouseData.position?.y * canvasDrawFractions.y - 3, 5, 5);

  const itemsToShow = [
    {
      name: "inputsToSimulate",
      value:
        game.debug.clientPrediction.inputsToSimulate &&
        game.debug.clientPrediction.inputsToSimulate.map((item) => item.type.slice(0, 1) + " " + item.number).toString(),
    },
    {
      name: "ticksSinceLastClientTickConfirmedByServer",
      value: game.debug.clientPrediction.ticksSinceLastClientTickConfirmedByServer?.toString(),
    },
    {
      name: "clientServerTickDifference",
      value: game.debug.clientPrediction.clientServerTickDifference?.toString(),
    },
    {
      name: "lastProcessedClientInputNumber",
      value: game.debug.clientPrediction.lastProcessedClientInputNumber?.toString(),
    },
    {
      name: "roundTripTime",
      value: game.debug.clientPrediction.roundTripTime?.toString(),
    },
    {
      name: "gameSpeedAdjustedForDeltaT",
      value: game.debug.general.gameSpeedAdjustedForDeltaT?.toString(),
    },
    {
      name: "deltaT",
      value: game.debug.general.deltaT?.toString(),
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
    context.fillText(item.name + ": " + item.value, marginLeft, i * spaceFromTop + spaceFromTop);
  });
}
