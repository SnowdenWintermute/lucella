import { BattleRoomGame, Point } from "../../../../common";

export default function mouseDownHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, currentGame: BattleRoomGame) {
  if (!(e.button === 0)) return;
  const { mouseData } = currentGame;
  mouseData.leftCurrentlyPressed = true;
  if (!mouseData.position) return;
  const { x, y } = mouseData.position;
  if (!mouseData.leftPressedAt) mouseData.leftPressedAt = new Point(x, y);
  mouseData.leftPressedAt.x = x;
  mouseData.leftPressedAt.y = y;
}
