import { Orb } from "../common/src/classes/Orb";

export default function drawSelectionRing(context: CanvasRenderingContext2D, orb: Orb) {
  if (!orb.isSelected) return;
  context.lineWidth = 3;
  context.strokeStyle = "rgb(30,200,30)";
  context.stroke();
}
