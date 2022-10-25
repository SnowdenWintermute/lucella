import { Orb, colors } from "../../../../../common";

export default function drawSelectionRing(context: CanvasRenderingContext2D, orb: Orb) {
  if (!orb.isSelected) return;
  context.lineWidth = 3;
  context.strokeStyle = colors.selectionRingColor;
  context.stroke();
}
