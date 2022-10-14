import { Orb } from "../../../../../common/Orb";
import { Point } from "../../../../../common";
import { ghostTransparency } from "../../../../../common";

export default function drawOrb(
  context: CanvasRenderingContext2D,
  orb: Orb,
  canvasDrawFractions: Point,
  showAsRing?: boolean
) {
  context.beginPath();
  context.fillStyle = orb.isGhost ? `rgba(${orb.color},${ghostTransparency})` : `rgb(${orb.color})`;
  context.ellipse(
    orb.position.x * canvasDrawFractions.x,
    orb.position.y * canvasDrawFractions.y,
    orb.radius * canvasDrawFractions.x,
    orb.radius * canvasDrawFractions.y,
    0,
    0,
    Math.PI * 2
  );
  showAsRing ? context.stroke() : context.fill();
}