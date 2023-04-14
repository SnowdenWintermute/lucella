export default function drawLine(
  context: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  thickness: number
) {
  context.beginPath();
  context.lineWidth = thickness;
  context.strokeStyle = `rgb(${color}`;
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
}
