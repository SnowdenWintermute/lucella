import { PlayerRole, colors, inGameFontSizes, Orb, Point } from "../../../../../../common";

export default function drawOrbNumber(context: CanvasRenderingContext2D, orb: Orb, playerRole: PlayerRole, canvasDrawFractions: Point) {
  if (orb.owner !== playerRole) return;

  if (orb.owner === PlayerRole.CHALLENGER) context.fillStyle = colors.light;
  else if (orb.owner === PlayerRole.HOST) context.fillStyle = colors.dark;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.y}px 'DM Sans'`;
  context.beginPath();
  context.fillText(orb.id.toString(), orb.body.position.x * canvasDrawFractions.x, orb.body.position.y * canvasDrawFractions.y);
}
