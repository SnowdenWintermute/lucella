import { BattleRoomGame, Point, ThemeColors, WidthAndHeight } from "../../../../../common";

export default function drawTextCenterScreen(
  context: CanvasRenderingContext2D,
  canvasDrawFractions: Point,
  color: string,
  marginBottom: number,
  fontSize: number,
  lines: string[]
) {
  context.fillStyle = `rgb(${color})`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${fontSize}px 'DM Sans'`;
  context.beginPath();
  lines.forEach((line, i) => {
    context.fillText(
      line,
      (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
      (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2 + (marginBottom + fontSize) * i
    );
  });
}
