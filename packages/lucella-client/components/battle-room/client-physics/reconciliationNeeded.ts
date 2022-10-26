import { BattleRoomGame, distanceBetweenTwoPoints, Orb, PlayerRole, reconciliationThreshold } from "../../../../common";

export default function reconciliationNeeded(
  lastUpdateFromServer: any,
  currentGame: BattleRoomGame,
  playerRole: PlayerRole
): boolean {
  const lastProcessedClientInputTick = lastUpdateFromServer.serverLastKnownClientTicks[playerRole];
  let value = false;
  let i = 0;
  while (!value && i < lastUpdateFromServer.orbs[playerRole]) {
    const orbToCompare = currentGame.orbs[playerRole][i];
    const positionDiscrepancy = distanceBetweenTwoPoints(
      lastUpdateFromServer.orbs[playerRole][i].position,
      orbToCompare.position
    );
    if (positionDiscrepancy > reconciliationThreshold && !value) {
      console.log(
        i + ": " + positionDiscrepancy + " tickDiff: " + (currentGame.currentTick - lastProcessedClientInputTick)
      );
      value = true;
    }
    i++;
  }

  return value;
}
