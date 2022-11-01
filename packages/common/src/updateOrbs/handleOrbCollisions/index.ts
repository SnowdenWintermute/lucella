import { BattleRoomGame } from "../../classes/BattleRoomGame";
import { Orb } from "../../classes/Orb";
import { PlayerRole } from "../../enums";
import orbsIntersecting from "./orbsIntersecting";

export default function (orb: Orb, game: BattleRoomGame, playerRole?: PlayerRole) {
  if (orb.isGhost) return;
  let comparedOrbIndex = 0;
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
  while (!orb.isGhost && comparedOrbIndex < game.orbs[opponentRole].length) {
    const orbToCheckIntersectionWith = game.orbs[opponentRole][comparedOrbIndex];
    if (orbsIntersecting(orb, orbToCheckIntersectionWith) && !orbToCheckIntersectionWith.isGhost) {
      orb.isGhost = true;
      orbToCheckIntersectionWith.isGhost = true;
      break;
    }
    comparedOrbIndex += 1;
  }
}
