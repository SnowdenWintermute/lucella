import { BattleRoomGame } from "../classes/BattleRoomGame";
import updateGhostOrb from "./updateGhostOrb";
import applyForceToOrb from "./applyForceToOrb";
import handleOrbInEndzone from "./handleOrbInEndzone";
import { PlayerRole } from "../enums";

export function updateOrbs(game: BattleRoomGame, playerRole?: PlayerRole) {
  let playerOrbs: keyof typeof game.orbs;
  for (playerOrbs in game.orbs) {
    if (playerRole && playerOrbs !== playerRole) continue;
    let orbLabel;
    for (orbLabel in game.orbs[playerOrbs]) {
      const orb = game.orbs[playerOrbs][orbLabel];
      updateGhostOrb(game, playerOrbs, orb);
      applyForceToOrb(orb, game);
      handleOrbInEndzone(orb, game, playerOrbs);
    }
  }
}
