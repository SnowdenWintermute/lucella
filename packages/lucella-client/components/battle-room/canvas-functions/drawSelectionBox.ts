import { MouseData, Point } from "../../../../common";

export default function first(
  context: CanvasRenderingContext2D,
  mouseData: MouseData,
  canvasDrawFractions: Point,
  selectionBoxSize: { width: number; height: number }
) {
  if (!mouseData.leftPressedAt) return;
  context.beginPath();
  context.strokeStyle = "rgb(103,191,104)";
  context.rect(
    mouseData.leftPressedAt.x * canvasDrawFractions.x,
    mouseData.leftPressedAt.y * canvasDrawFractions.y,
    selectionBoxSize.width,
    selectionBoxSize.height
  );
  context.lineWidth = 3;
  context.stroke();
}
