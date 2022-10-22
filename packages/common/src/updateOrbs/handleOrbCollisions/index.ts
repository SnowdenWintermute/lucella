import { BattleRoomGame } from "../../classes/BattleRoomGame";
import orbsIntersecting from "./orbsIntersecting";

export default function (game: BattleRoomGame) {
  game.orbs.host.forEach((orb) => {
    if (orb.isGhost) return;
    let comparedOrbIndex = 0;
    while (!orb.isGhost && comparedOrbIndex < game.orbs.challenger.length) {
      const orbToCheckIntersectionWith = game.orbs.challenger[comparedOrbIndex];
      if (orbsIntersecting(orb, orbToCheckIntersectionWith) && !orbToCheckIntersectionWith.isGhost) {
        orb.isGhost = true;
        orbToCheckIntersectionWith.isGhost = true;
        break;
      }
      comparedOrbIndex += 1;
    }
  });
}
