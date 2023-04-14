import { PlayerRole, Point, BattleRoomGame, ThemeColors } from "../../../../../../common";
import drawOrb from "./drawOrb";
import drawOrbNumber from "./drawOrbNumber";
import drawSelectionRing from "./drawSelectionRing";
import drawWaypointPath from "./drawWaypointPath";

export function drawOrbs(
  context: CanvasRenderingContext2D,
  playerRole: PlayerRole,
  game: BattleRoomGame,
  canvasDrawFractions: Point,
  themeColors: ThemeColors
) {
  if (game.netcode.lastUpdateFromServer && game.debug.mode > 0) {
    Object.entries(game.netcode.lastUpdateFromServer.orbs).forEach(([owner, lastServerOrbSet]) => {
      // if (lastServerOrbSets !== playerRole) continue;
      Object.values(lastServerOrbSet).forEach((orb) => {
        drawOrb(context, orb, canvasDrawFractions, game.debug.mode, owner as PlayerRole, themeColors, true);
      });
    });
  }

  Object.entries(game.orbs).forEach(([owner, orbSet]) => {
    Object.values(orbSet).forEach((orb) => {
      drawOrb(context, orb, canvasDrawFractions, game.debug.mode, owner as PlayerRole, themeColors, false);
      drawOrbNumber(context, orb, playerRole, canvasDrawFractions, themeColors);
      drawSelectionRing(context, canvasDrawFractions, orb, themeColors);
      drawWaypointPath(context, orb, canvasDrawFractions, themeColors);
    });
  });
}
