/* eslint-disable no-unused-expressions */
/* eslint-disable no-multi-assign */
import { Orb, ghostTransparency, Point, PlayerRole, ThemeColors } from "../../../../../../common";
import drawOrbDebugText from "./drawOrbDebugText";
import drawVectors from "./drawVectors";

export default function drawOrb(
  context: CanvasRenderingContext2D,
  orb: Orb,
  canvasDrawFractions: Point,
  debugMode: number,
  owner: PlayerRole,
  themeColors: ThemeColors,
  showAsRing?: boolean
) {
  const { x, y } = orb.body.position;
  const { circleRadius } = orb.body;
  if (!circleRadius) console.log("NO CIRCLE RADIUS");
  const rx = x * canvasDrawFractions.x;
  const ry = y * canvasDrawFractions.y;

  const ORB_FILL = owner === PlayerRole.HOST ? themeColors.LIGHT : themeColors.DARK;
  const ORB_STROKE = owner === PlayerRole.HOST ? themeColors.DARK : themeColors.LIGHT;
  context.fillStyle = context.strokeStyle = orb.isGhost ? `rgba(${ORB_FILL},${ghostTransparency})` : `rgb(${ORB_FILL})`;
  context.beginPath();
  context.ellipse(rx, ry, circleRadius! * canvasDrawFractions.x, circleRadius! * canvasDrawFractions.y, 0, 0, Math.PI * 2);
  showAsRing ? context.stroke() : context.fill();
  context.lineWidth = 1;
  context.strokeStyle = orb.isGhost ? `rgb(${ORB_STROKE}, ${ghostTransparency})` : `rgb(${ORB_STROKE})`;
  context.beginPath();
  context.ellipse(rx, ry, circleRadius! * canvasDrawFractions.x, circleRadius! * canvasDrawFractions.y, 0, 0, Math.PI * 2);
  context.stroke();

  if (debugMode > 0) {
    drawVectors(context, orb, canvasDrawFractions);
    if (orb.destination && orb.destination.x && orb.destination.y) {
      context.fillStyle = "red";
      context.beginPath();
      context.fillRect(orb.destination.x * canvasDrawFractions.x - 2, orb.destination.y * canvasDrawFractions.y - 2, 5, 5);
    }
  }
  if (debugMode > 1) drawOrbDebugText(context, orb, canvasDrawFractions);
}
