import MouseData from "../common/src/classes/MouseData";
import { Point } from "../common/src/classes/Point";

export default (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, mouseData: MouseData) => {
  if (!(e.button === 0)) return;
  mouseData.leftCurrentlyPressed = true;
  if (!mouseData.position) return;
  const { x, y } = mouseData.position;
  if (!mouseData.leftPressedAt) mouseData.leftPressedAt = new Point(x, y);
  mouseData.leftPressedAt.x = x;
  mouseData.leftPressedAt.y = y;
};
