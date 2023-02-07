import { PlayerRole, Point, BattleRoomGame } from "../../../../../../common";
import drawOrb from "./drawOrb";
import drawOrbNumber from "./drawOrbNumber";
import drawSelectionRing from "./drawSelectionRing";

export function drawOrbs(context: CanvasRenderingContext2D, playerRole: PlayerRole, game: BattleRoomGame, canvasDrawFractions: Point, showAsRing?: boolean) {
  if (game.netcode.lastUpdateFromServer && game.debug.mode > 0) {
    Object.values(game.netcode.lastUpdateFromServer.orbs).forEach((lastServerOrbSet) => {
      // if (lastServerOrbSets !== playerRole) continue;
      Object.values(lastServerOrbSet).forEach((orb) => {
        drawOrb(context, orb, canvasDrawFractions, game.debug.mode, true);
      });
    });
  }

  Object.values(game.orbs).forEach((orbSet) => {
    Object.values(orbSet).forEach((orb) => {
      drawOrb(context, orb, canvasDrawFractions, game.debug.mode, showAsRing);
      drawOrbNumber(context, orb, playerRole, canvasDrawFractions);
      drawSelectionRing(context, orb);
    });
  });
}
