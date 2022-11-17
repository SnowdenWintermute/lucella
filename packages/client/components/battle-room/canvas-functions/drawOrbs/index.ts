import { PlayerRole, Point, BattleRoomGame, Orb } from "../../../../../common";
import drawOrb from "./drawOrb";
import drawOrbNumber from "./drawOrbNumber";
import drawSelectionRing from "./drawSelectionRing";

export function drawOrbs(context: CanvasRenderingContext2D, playerRole: PlayerRole, game: BattleRoomGame, canvasDrawFractions: Point, showAsRing?: boolean) {
  if (game.netcode.lastUpdateFromServer && game.debug.showDebug) {
    let lastServerOrbSets: keyof typeof game.netcode.lastUpdateFromServer.orbs;
    for (lastServerOrbSets in game.netcode.lastUpdateFromServer.orbs) {
      // if (lastServerOrbSets !== playerRole) continue;
      for (let orb in game.netcode.lastUpdateFromServer.orbs[lastServerOrbSets])
        drawOrb(context, game.netcode.lastUpdateFromServer.orbs[lastServerOrbSets][orb], canvasDrawFractions, true, game.debug.showDebug);
    }
  }

  let orbSet: keyof typeof game.orbs;
  for (orbSet in game.orbs) {
    for (let orbLabel in game.orbs[orbSet]) {
      drawOrb(context, game.orbs[orbSet][orbLabel], canvasDrawFractions, showAsRing, false);
      drawOrbNumber(context, game.orbs[orbSet][orbLabel], playerRole, canvasDrawFractions);
      drawSelectionRing(context, game.orbs[orbSet][orbLabel]);
    }
  }
}
