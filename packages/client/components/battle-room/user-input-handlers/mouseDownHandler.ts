import { BattleRoomGame, Point, WidthAndHeight } from "../../../../common";

export default function mouseDownHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) {
  if (!(e.button === 0)) return;
  const { mouseData } = currentGame;
  mouseData.leftCurrentlyPressed = true;
  const x = Math.round((e.nativeEvent.offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width);
  const y = Math.round((e.nativeEvent.offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height);
  if (mouseData.position === null) mouseData.position = new Point(x, y);
  mouseData.leftPressedAt = new Point(x, y);
}
