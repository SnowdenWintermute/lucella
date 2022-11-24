import { BattleRoomGame, OrbDeltas, OrbSetDeltas, PlayerRole, Point } from "../../../../../../common";
import isEqual from "lodash.isequal";

export default function determineOrbDeltas(game: BattleRoomGame, playerRole: PlayerRole, isOpponent?: boolean) {
  if (!game.netcode.prevGameState) return console.log("no prev game state yet", game.netcode.prevGameState); // send full game data
  const orbsDeltasToSerialize: OrbSetDeltas = {};
  for (let orbLabel in game.netcode.prevGameState.orbs[playerRole]) {
    const prevOrbState = game.netcode.prevGameState.orbs[playerRole][orbLabel];
    const currOrb = game.orbs[playerRole][orbLabel];
    const orbDeltas: OrbDeltas = {};
    if (!isEqual(currOrb.body.position, prevOrbState.body.position)) orbDeltas.position = currOrb.body.position;
    if (!isOpponent && !isEqual(currOrb.body.velocity, prevOrbState.body.velocity)) orbDeltas.velocity = currOrb.body.velocity;
    if (!isOpponent && !isEqual(currOrb.body.force, prevOrbState.body.force)) orbDeltas.force = currOrb.body.force;
    if (!isOpponent && !isEqual(currOrb.destination, prevOrbState.destination)) orbDeltas.destination = currOrb.destination;
    if (currOrb.isSelected !== prevOrbState.isSelected) orbDeltas.isSelected = currOrb.isSelected;
    if (currOrb.isGhost !== prevOrbState.isGhost) orbDeltas.isGhost = currOrb.isGhost;
    if (Object.keys(orbDeltas).length) orbsDeltasToSerialize[orbLabel] = orbDeltas;
  }
  return orbsDeltasToSerialize;
}
