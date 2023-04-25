import { Vector } from "matter-js";
import { Orb, Point } from "../../../../../../common";

export default function drawVectors(context: CanvasRenderingContext2D, orb: Orb, canvasDrawFractions: Point) {
  if (!orb.destination) return;
  const { x, y } = orb.body.position;
  const { circleRadius, force, velocity } = orb.body;
  const rx = x * canvasDrawFractions.x;
  const ry = y * canvasDrawFractions.y;
  const deltaVector = Vector.sub(orb.destination, orb.body.position);

  context.strokeStyle = "blue";
  context.beginPath();
  context.moveTo(rx, ry);
  context.lineTo((x + deltaVector.x) * canvasDrawFractions.x, (y + deltaVector.y) * canvasDrawFractions.y);
  context.stroke();
  context.strokeStyle = "red";
  context.beginPath();
  context.moveTo(rx, ry);
  context.lineTo((x + force.x) * canvasDrawFractions.x, (y + force.y) * canvasDrawFractions.y);
  context.stroke();
}
