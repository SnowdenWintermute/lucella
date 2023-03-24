import { MouseData, Point, ThemeColors } from "../../../../../common";

export default function first(
  context: CanvasRenderingContext2D,
  mouseData: MouseData,
  canvasDrawFractions: Point,
  selectionBoxSize: { width: number; height: number },
  themeColors: ThemeColors
) {
  if (!mouseData.leftPressedAt) return;
  context.strokeStyle = `rgb(${themeColors.SELECTION})`;
  context.lineWidth = 3;
  context.beginPath();
  context.rect(
    mouseData.leftPressedAt.x * canvasDrawFractions.x,
    mouseData.leftPressedAt.y * canvasDrawFractions.y,
    selectionBoxSize.width,
    selectionBoxSize.height
  );
  context.stroke();
}
