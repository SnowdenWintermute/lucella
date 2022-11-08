import { BattleRoomGame, PlayerRole } from "../../../../common";

export default function (game: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole, frameTime: number, roundTripTime: number | undefined) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];
  game.debug.clientPrediction.inputsToSimulate = game.queues.client.localInputs;
  game.debug.clientPrediction.lastProcessedClientInputNumber = lastProcessedClientInputNumber;
  game.debug.clientPrediction.frameTime = frameTime;
  if (roundTripTime) game.debug.clientPrediction.roundTripTime = roundTripTime;
}
