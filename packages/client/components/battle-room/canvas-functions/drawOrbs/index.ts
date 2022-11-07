import { PlayerRole, Point, BattleRoomGame, Orb } from "@lucella/common";
import drawOrb from "./drawOrb";
import drawOrbNumber from "./drawOrbNumber";
import drawSelectionRing from "./drawSelectionRing";

export function drawOrbs(context: CanvasRenderingContext2D, playerRole: PlayerRole, game: BattleRoomGame, canvasDrawFractions: Point, showAsRing?: boolean) {
  if (game.lastUpdateFromServer && game.debug.showDebug) {
    let lastServerOrbSets: keyof typeof game.lastUpdateFromServer.orbs;
    for (lastServerOrbSets in game.lastUpdateFromServer.orbs) {
      // if (lastServerOrbSets !== playerRole) continue;
      for (let orb in game.lastUpdateFromServer.orbs[lastServerOrbSets])
        drawOrb(context, game.lastUpdateFromServer.orbs[lastServerOrbSets][orb], canvasDrawFractions, game.debug.showDebug);
    }
  }

  let orbSet: keyof typeof game.orbs;
  for (orbSet in game.orbs) {
    for (let orbLabel in game.orbs[orbSet]) {
      drawOrb(context, game.orbs[orbSet][orbLabel], canvasDrawFractions, showAsRing, game.debug.showDebug);
      drawOrbNumber(context, game.orbs[orbSet][orbLabel], playerRole, canvasDrawFractions);
      drawSelectionRing(context, game.orbs[orbSet][orbLabel]);
    }
  }
}
