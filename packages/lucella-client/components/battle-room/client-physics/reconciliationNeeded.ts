import { BattleRoomGame, distanceBetweenTwoPoints, Orb, PlayerRole } from "../../../../common";

export default function reconciliationNeeded(
  lastUpdateFromServer: any,
  currentGame: BattleRoomGame,
  playerRole: PlayerRole
) {
  const lastProcessedClientInputTick = lastUpdateFromServer.serverLastKnownClientTicks[playerRole];

  lastUpdateFromServer.orbs[playerRole].forEach((orb: Orb, i: number) => {
    const orbToCompare = currentGame.orbs[playerRole][i];
    const positionDiscrepancy = distanceBetweenTwoPoints(orb.position, orbToCompare.position);
    if (positionDiscrepancy > 5) {
      console.log(
        i + ": " + positionDiscrepancy + " tickDiff: " + (currentGame.currentTick - lastProcessedClientInputTick)
      );
    }
  });
}
