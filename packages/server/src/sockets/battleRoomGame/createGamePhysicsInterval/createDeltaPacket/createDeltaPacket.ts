import isEqual from "lodash.isequal";
import { BattleRoomGame, PlayerRole } from "../../../../../../common/dist";

const orbBodyPropNames = ["position", "inertia", "velocity", "angle", "angularVelocity"];

export default function (game: BattleRoomGame, playerRole: PlayerRole) {
  if (!game.netcode.prevGameState) return; // send full data
  const changedOrbs = {};

  for (let orbLabel in game.netcode.prevGameState.orbs[playerRole]) {
    const prevOrbState = game.netcode.prevGameState.orbs[playerRole][orbLabel];
    const currOrb = game.orbs[playerRole][orbLabel];
    if (!isEqual(currOrb.body.position, prevOrbState.body.position)) console.log("different position for " + orbLabel);
  }
}
