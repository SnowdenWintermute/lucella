import { BattleRoomGame } from "../classes/BattleRoomGame";
import updateGhostOrb from "./updateGhostOrb";
import moveOrb from "./moveOrb";
import handleOrbInEndzone from "./handleOrbInEndzone";
import { PlayerRole } from "../enums";
import Matter from "matter-js";
import { renderRate } from "../consts";

export function updateOrbs(game: BattleRoomGame, deltaT?: number, playerRole?: PlayerRole) {
  let playerOrbs: keyof typeof game.orbs;
  for (playerOrbs in game.orbs) {
    if (playerRole && playerOrbs !== playerRole) continue;
    let orbLabel;
    for (orbLabel in game.orbs[playerOrbs]) {
      const orb = game.orbs[playerOrbs][orbLabel];
      updateGhostOrb(game, playerOrbs, orb);
      moveOrb(orb, game, deltaT);
      handleOrbInEndzone(orb, game, playerOrbs);
    }
    Matter.Engine.update(game.physicsEngine!, renderRate);
  }
}
