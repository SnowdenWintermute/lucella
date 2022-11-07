import { BattleRoomGame, PlayerRole } from "@lucella/common";

export default function (game: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];
  if (game.queues.client.localInputs.length < 0 || !lastProcessedClientInputNumber) return;
  let localCopyOfLastInputProcessedByServer;
  let searchIndex = 0;
  while (!localCopyOfLastInputProcessedByServer && searchIndex < game.queues.client.localInputs.length) {
    if (game.queues.client.localInputs[searchIndex].number === lastProcessedClientInputNumber)
      localCopyOfLastInputProcessedByServer = game.queues.client.localInputs[searchIndex];
    searchIndex += 1;
  }
  if (localCopyOfLastInputProcessedByServer) return +Date.now() - localCopyOfLastInputProcessedByServer.timeCreated;
}