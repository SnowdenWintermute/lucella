import { BattleRoomGame, OrbDeltas, OrbSetDeltas, PlayerRole, Point } from "../../../../../../common";
import isEqual from "lodash.isequal";

const orbPropNames = ["isSelected", "isGhost", "destination"];
const propsToOmitFromOpponentOrbs = ["destination"];

export default function determineOrbDeltas(game: BattleRoomGame, playerRole: PlayerRole, isOpponent?: boolean) {
  if (!game.netcode.prevGameState) return; // send full game data

  const orbsDeltasToSerialize: OrbSetDeltas = {};
  for (let orbLabel in game.netcode.prevGameState.orbs[playerRole]) {
    const prevOrbState = game.netcode.prevGameState.orbs[playerRole][orbLabel];
    const currOrb = game.orbs[playerRole][orbLabel];
    const orbDeltas: OrbDeltas = {};
    if (!isEqual(currOrb.body.position, prevOrbState.body.position)) {
      orbDeltas.position = currOrb.body.position;
      console.log("positions not equal, ", currOrb.body.position);
    }
    if (currOrb.isSelected !== prevOrbState.isSelected) orbDeltas.isSelected = currOrb.isSelected;
    if (currOrb.isGhost !== prevOrbState.isGhost) orbDeltas.isGhost = currOrb.isGhost;
    if (!isOpponent && !isEqual(currOrb.destination, prevOrbState.destination)) orbDeltas.destination = currOrb.destination || undefined;
    if (Object.keys(orbDeltas).length) orbsDeltasToSerialize[orbLabel] = orbDeltas;
  }
  return orbsDeltasToSerialize;
}
