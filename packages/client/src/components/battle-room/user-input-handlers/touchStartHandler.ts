import { BattleRoomGame, WidthAndHeight, Point } from "../../../../../common";

export default function touchStartHandler(e: React.TouchEvent<HTMLCanvasElement>, canvasSize: WidthAndHeight, currentGame: BattleRoomGame) {
  if (!e.target) return;
  const { mouseData } = currentGame;
  const node = e.target as HTMLElement;
  const rect = node.getBoundingClientRect();
  const offsetX = e.targetTouches[0].pageX - rect.left;
  const offsetY = e.targetTouches[0].pageY - rect.top;
  if (!mouseData.touchStart) mouseData.touchStart = new Point(0, 0);
  if (!mouseData.leftPressedAt) mouseData.leftPressedAt = new Point(0, 0);
  mouseData.touchStart.x = mouseData.leftPressedAt.x = (offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width;
  mouseData.touchStart.y = mouseData.leftPressedAt.y = (offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height;
  mouseData.touchStartTime = Date.now();
}
