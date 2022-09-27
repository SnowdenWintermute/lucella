import { BattleRoomGame } from "../../../../../common/src/classes/BattleRoomGame";
import { Point } from "../../../../../common/src/classes/Point";
import { PlayerRole } from "../../../../../common/src/enums";
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
  let orbSet: keyof typeof currentGame.orbs;
  for (orbSet in currentGame.orbs) {
    currentGame.orbs[orbSet].forEach((orb) => {
      drawOrb(context, orb, canvasDrawFractions, showAsRing);
      drawOrbNumber(context, orb, playerRole, canvasDrawFractions);
      drawSelectionRing(context, orb);
    });
  }
}
