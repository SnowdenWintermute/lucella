import { BattleRoomGame } from "../classes/BattleRoomGame";
import updateGhostOrb from "./updateGhostOrb";
import applyForceToOrb from "./applyForceToOrb";
import handleOrbInEndzone from "./handleOrbInEndzone";
import { PlayerRole } from "../enums";

export function updateOrbs(game: BattleRoomGame, playerRole?: PlayerRole) {
  Object.entries(game.orbs).forEach(([player, orbSet]) => {
    if (playerRole && player !== playerRole) return;
    Object.values(orbSet).forEach((orb) => {
      updateGhostOrb(game, player as PlayerRole, orb);
      applyForceToOrb(orb, game);
      handleOrbInEndzone(orb, game, player as PlayerRole);
    });
  });
}
