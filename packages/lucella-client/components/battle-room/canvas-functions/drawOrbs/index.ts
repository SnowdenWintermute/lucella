import { PlayerRole, Point, BattleRoomGame, Orb } from "../../../../../common";
import drawOrb from "./drawOrb";
import drawOrbNumber from "./drawOrbNumber";
import drawSelectionRing from "./drawSelectionRing";

export function drawOrbs(
  context: CanvasRenderingContext2D,
  playerRole: PlayerRole,
  currentGame: BattleRoomGame,
  canvasDrawFractions: Point,
  showAsRing?: boolean
) {
  if (currentGame.lastUpdateFromServer) {
    let lastServerOrbSets: keyof typeof currentGame.lastUpdateFromServer.orbs;
    for (lastServerOrbSets in currentGame.lastUpdateFromServer.orbs) {
      currentGame.lastUpdateFromServer.orbs[lastServerOrbSets].forEach((orb: Orb) => {
        drawOrb(context, orb, canvasDrawFractions, true);
        // drawOrbNumber(context, orb, playerRole, canvasDrawFractions);
        // drawSelectionRing(context, orb);
      });
    }
  }

  let orbSet: keyof typeof currentGame.orbs;
  for (orbSet in currentGame.orbs) {
    currentGame.orbs[orbSet].forEach((orb) => {
      drawOrb(context, orb, canvasDrawFractions, showAsRing);
      drawOrbNumber(context, orb, playerRole, canvasDrawFractions);
      drawSelectionRing(context, orb);
    });
  }
}
