import { BattleRoomGame } from "../classes/BattleRoomGame";
import updateGhostOrb from "./updateGhostOrb";
import moveOrb from "./moveOrb";
import handleOrbCollisions from "./handleOrbCollisions";
import handleOrbInEndzone from "./handleOrbInEndzone";
import { PlayerRole } from "../enums";

export function updateOrbs(game: BattleRoomGame, deltaT?: number, playerRole?: PlayerRole) {
  let playerOrbs: keyof typeof game.orbs;
  for (playerOrbs in game.orbs) {
    if (playerRole && playerOrbs !== playerRole) continue;
    game.orbs[playerOrbs].forEach((orb) => {
      updateGhostOrb(game, playerOrbs, orb);
      moveOrb(orb, game, deltaT);
      handleOrbInEndzone(orb, game, playerOrbs);
      playerOrbs === PlayerRole.HOST && handleOrbCollisions(orb, game);
    });
  }
}
