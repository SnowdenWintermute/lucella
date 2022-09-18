import MouseData from "@lucella/common/battleRoomGame/classes/MouseData";
import { Point } from "@lucella/common/battleRoomGame/classes/Point";

export default (e: MouseEvent, mouseData: MouseData) => {
  if (!(e.button === 0)) return;
  mouseData.leftCurrentlyPressed = true;
  if (!mouseData.position) return;
  const { x, y } = mouseData.position;
  if (!mouseData.leftPressedAt) mouseData.leftPressedAt = new Point(x, y);
  mouseData.leftPressedAt.x = x;
  mouseData.leftPressedAt.y = y;
};
