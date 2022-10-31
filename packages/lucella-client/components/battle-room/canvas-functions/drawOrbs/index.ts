import { PlayerRole, Point, BattleRoomGame, Orb } from "../../../../../common";
import drawOrb from "./drawOrb";
import drawOrbNumber from "./drawOrbNumber";
import drawSelectionRing from "./drawSelectionRing";

export function drawOrbs(context: CanvasRenderingContext2D, playerRole: PlayerRole, game: BattleRoomGame, canvasDrawFractions: Point, showAsRing?: boolean) {
  if (game.lastUpdateFromServer && game.debug.showDebug) {
    let lastServerOrbSets: keyof typeof game.lastUpdateFromServer.orbs;
    for (lastServerOrbSets in game.lastUpdateFromServer.orbs) {
      if (lastServerOrbSets !== playerRole) continue;
      game.lastUpdateFromServer.orbs[lastServerOrbSets].forEach((orb: Orb) => {
        drawOrb(context, orb, canvasDrawFractions, game.debug.showDebug);
        // drawOrbNumber(context, orb, playerRole, canvasDrawFractions);
        // drawSelectionRing(context, orb);
      });
    }
  }

  let orbSet: keyof typeof game.orbs;
  for (orbSet in game.orbs) {
    game.orbs[orbSet].forEach((orb) => {
      drawOrb(context, orb, canvasDrawFractions, showAsRing, game.debug.showDebug);
      drawOrbNumber(context, orb, playerRole, canvasDrawFractions);
      drawSelectionRing(context, orb);
    });
  }
}
