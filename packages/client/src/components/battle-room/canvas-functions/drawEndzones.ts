import { BattleRoomGame, WidthAndHeight, Point, ThemeColors } from "../../../../../common";

function drawEndzone(
  context: CanvasRenderingContext2D,
  canvasSize: WidthAndHeight,
  origin: Point,
  height: number,
  borderPosition: "TOP" | "BOTTOM",
  themeColors: ThemeColors
) {
  const { x, y } = origin;
  const { width } = canvasSize;
  context.fillStyle = `rgb(${themeColors.DARK})`;
  context.beginPath();
  context.fillRect(x, y, width, height);

  context.strokeStyle = `rgb(${themeColors.LIGHT})`;
  context.lineWidth = 1;
  context.beginPath();
  if (borderPosition === "BOTTOM") {
    context.moveTo(x, y + height);
    context.lineTo(x + width, y + height);
  } else {
    context.moveTo(x, y);
    context.lineTo(x + width, y);
  }
  context.stroke();
}

export default function drawEndzones(context: CanvasRenderingContext2D, currentGame: BattleRoomGame, canvasSize: WidthAndHeight, themeColors: ThemeColors) {
  const hostEndzoneHeight = (currentGame.endzones.host.height / BattleRoomGame.baseWindowDimensions.height) * canvasSize.height;
  drawEndzone(context, canvasSize, currentGame.endzones.host.origin, hostEndzoneHeight, "BOTTOM", themeColors);
  const challengerEndzoneHeight = (currentGame.endzones.challenger.height / BattleRoomGame.baseWindowDimensions.height) * canvasSize.height;
  const challengerEndzoneAdjustedOriginY = (currentGame.endzones.challenger.origin.y / BattleRoomGame.baseWindowDimensions.height) * canvasSize.height;
  const challengerEndzoneAdjustedOrigin = new Point(currentGame.endzones.challenger.origin.x, challengerEndzoneAdjustedOriginY);
  drawEndzone(context, canvasSize, challengerEndzoneAdjustedOrigin, challengerEndzoneHeight, "TOP", themeColors);
}
