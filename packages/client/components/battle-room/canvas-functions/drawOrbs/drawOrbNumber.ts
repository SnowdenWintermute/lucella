import { PlayerRole, colors, inGameFontSizes, Orb, Point } from "@lucella/common";

export default function drawOrbNumber(context: CanvasRenderingContext2D, orb: Orb, playerRole: PlayerRole, canvasDrawFractions: Point) {
  if (orb.owner !== playerRole) return;
  context.fillStyle = colors.inGameTextLight;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;
  context.fillText(orb.id.toString(), orb.body.position.x * canvasDrawFractions.x, orb.body.position.y * canvasDrawFractions.y);
}
