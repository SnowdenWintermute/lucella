import { Orb } from "../../../../../common/Orb";
import { Point } from "../../../../../common/Point";
import { colors, inGameFontSizes } from "../../../../../common";
import { PlayerRole } from "../../../../../common";

export default function drawOrbNumber(
  context: CanvasRenderingContext2D,
  orb: Orb,
  playerRole: PlayerRole,
  canvasDrawFractions: Point
) {
  if (orb.owner !== playerRole) return;
  context.fillStyle = colors.inGameTextLight;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;
  context.fillText(orb.id.toString(), orb.position.x * canvasDrawFractions.x, orb.position.y * canvasDrawFractions.y);
}
