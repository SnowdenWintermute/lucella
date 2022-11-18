import Matter from "matter-js";
import { Vector } from "matter-js";
import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";
import { Orb, ghostTransparency, Point, inGameFontSizes } from "../../../../../common";
import drawOrbDebug from "./drawOrbDebug";
import drawVectors from "./drawVectors";

export default function drawOrb(context: CanvasRenderingContext2D, orb: Orb, canvasDrawFractions: Point, showAsRing?: boolean, debug?: boolean) {
  const { x, y } = orb.body.position;
  const { circleRadius, force, velocity } = orb.body;
  const rx = x * canvasDrawFractions.x;
  const ry = y * canvasDrawFractions.y;
  context.beginPath();
  context.fillStyle = context.strokeStyle = orb.isGhost ? `rgba(${orb.color},${ghostTransparency})` : `rgb(${orb.color})`;
  context.ellipse(rx, ry, circleRadius! * canvasDrawFractions.x, circleRadius! * canvasDrawFractions.y, 0, 0, Math.PI * 2);
  showAsRing ? context.stroke() : context.fill();
  if (debug) {
    drawVectors(context, orb, canvasDrawFractions);
    drawOrbDebug(context, orb, canvasDrawFractions);
  }
}
