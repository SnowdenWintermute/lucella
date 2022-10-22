import { BattleRoomGame } from "../classes/BattleRoomGame";
import updateGhostOrb from "./updateGhostOrb";
import moveOrb from "./moveOrb";
import handleOrbCollisions from "./handleOrbCollisions";

export function updateOrbs(game: BattleRoomGame, deltaT?: number) {
  let playerRole: keyof typeof game.orbs;
  for (playerRole in game.orbs) {
    game.orbs[playerRole].forEach((orb) => {
      updateGhostOrb(game, playerRole, orb);
      moveOrb(orb, game, deltaT);
    });
  }
  handleOrbCollisions(game);
}
