import { Orb, Point, ThemeColors } from "../../../../../../common";

export default function drawSelectionRing(context: CanvasRenderingContext2D, canvasDrawFractions: Point, orb: Orb, themeColors: ThemeColors) {
  const { x, y } = orb.body.position;
  const { circleRadius } = orb.body;
  if (!circleRadius) console.log("NO CIRCLE RADIUS");
  const rx = x * canvasDrawFractions.x;
  const ry = y * canvasDrawFractions.y;
  if (!orb.isSelected) return;
  context.lineWidth = 3;
  context.strokeStyle = `rgb(${themeColors.SELECTION}`;
  context.beginPath();
  context.ellipse(rx, ry, circleRadius! * canvasDrawFractions.x, circleRadius! * canvasDrawFractions.y, 0, 0, Math.PI * 2);
  context.stroke();
}
