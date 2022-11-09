import isEqual from "lodash.isequal";
import { BattleRoomGame, Orb, PlayerRole, Point } from "../../../../../../common/dist";

const orbBodyPropNames = ["position", "inertia", "velocity", "angle"];

type OrbDeltas = { position?: Point; inertia?: number; velocity?: number; angle?: number; isSelected?: boolean; isGhost?: boolean };

export default function (game: BattleRoomGame, playerRole: PlayerRole) {
  if (!game.netcode.prevGameState) return; // send full data
  const changedOrbsDeltas: {
    [orbLabel: string]: OrbDeltas;
  } = {};
  for (let orbLabel in game.netcode.prevGameState.orbs[playerRole]) {
    const prevOrbState = game.netcode.prevGameState.orbs[playerRole][orbLabel];
    const currOrb = game.orbs[playerRole][orbLabel];
    const orbDeltas: OrbDeltas = {};
    orbBodyPropNames.forEach((propName) => {
      // @ts-ignore
      if (!isEqual(currOrb.body[propName], prevOrbState.body[propName])) orbDeltas[propName] = currOrb.body[propName];
    });
    if (currOrb.isGhost !== prevOrbState.isGhost) orbDeltas.isGhost = currOrb.isGhost;
    if (currOrb.isSelected !== prevOrbState.isSelected) orbDeltas.isSelected = currOrb.isSelected;

    if (Object.keys(orbDeltas).length) changedOrbsDeltas[orbLabel] = orbDeltas;
  }
  if (Object.keys(changedOrbsDeltas).length) console.log(changedOrbsDeltas);
}
