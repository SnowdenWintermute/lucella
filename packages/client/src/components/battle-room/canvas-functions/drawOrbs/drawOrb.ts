/* eslint-disable no-unused-expressions */
/* eslint-disable no-multi-assign */
import { Orb, ghostTransparency, Point } from "../../../../../../common";
import drawOrbDebugText from "./drawOrbDebugText";
import drawVectors from "./drawVectors";

export default function drawOrb(context: CanvasRenderingContext2D, orb: Orb, canvasDrawFractions: Point, debugMode: number, showAsRing?: boolean) {
  const { x, y } = orb.body.position;
  const { circleRadius } = orb.body;
  if (!circleRadius) console.log("NO CIRCLE RADIUS");
  const rx = x * canvasDrawFractions.x;
  const ry = y * canvasDrawFractions.y;
  context.beginPath();
  context.fillStyle = context.strokeStyle = orb.isGhost ? `rgba(${orb.color},${ghostTransparency})` : `rgb(${orb.color})`;
  context.ellipse(rx, ry, circleRadius! * canvasDrawFractions.x, circleRadius! * canvasDrawFractions.y, 0, 0, Math.PI * 2);
  showAsRing ? context.stroke() : context.fill();
  if (debugMode > 0) {
    drawVectors(context, orb, canvasDrawFractions);
    context.fillStyle = "red";
    orb.destination &&
      orb.destination.x &&
      orb.destination.y &&
      context.fillRect(orb.destination.x * canvasDrawFractions.x - 2, orb.destination.y * canvasDrawFractions.y - 2, 5, 5);
  }
  if (debugMode > 1) drawOrbDebugText(context, orb, canvasDrawFractions);
}
