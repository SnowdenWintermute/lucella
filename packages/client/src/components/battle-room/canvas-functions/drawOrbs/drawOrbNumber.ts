import { PlayerRole, inGameFontSizes, Orb, Point, ThemeColors } from "../../../../../../common";

export default function drawOrbNumber(
  context: CanvasRenderingContext2D,
  orb: Orb,
  playerRole: PlayerRole,
  canvasDrawFractions: Point,
  themeColors: ThemeColors
) {
  if (orb.owner !== playerRole) return;

  if (orb.owner === PlayerRole.CHALLENGER) context.fillStyle = `rgb(${themeColors.LIGHT})`;
  else if (orb.owner === PlayerRole.HOST) context.fillStyle = `rgb(${themeColors.DARK})`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.y}px 'DM Sans'`;
  context.beginPath();
  context.fillText(orb.id.toString(), orb.body.position.x * canvasDrawFractions.x, orb.body.position.y * canvasDrawFractions.y);
}
