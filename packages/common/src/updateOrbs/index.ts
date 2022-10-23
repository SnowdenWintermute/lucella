import { BattleRoomGame } from "../classes/BattleRoomGame";
import updateGhostOrb from "./updateGhostOrb";
import moveOrb from "./moveOrb";
import handleOrbCollisions from "./handleOrbCollisions";
import handleOrbInEndzone from "./handleOrbInEndzone";
import { PlayerRole } from "../enums";

export function updateOrbs(game: BattleRoomGame, deltaT?: number) {
  let playerRole: keyof typeof game.orbs;
  for (playerRole in game.orbs) {
    game.orbs[playerRole].forEach((orb) => {
      updateGhostOrb(game, playerRole, orb);
      moveOrb(orb, game, deltaT);
      handleOrbInEndzone(orb, game, playerRole);
      playerRole === PlayerRole.HOST && handleOrbCollisions(orb, game);
    });
  }
}
