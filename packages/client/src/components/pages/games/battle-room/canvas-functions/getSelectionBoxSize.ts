import MouseData from "@lucella/common/battleRoomGame/classes/MouseData";
import { Point } from "@lucella/common/battleRoomGame/classes/Point";

const getSelectionBoxSize = (mouseData: MouseData, canvasDrawFractions: Point) => {
  if (!mouseData.mouseOnScreen) mouseData.leftCurrentlyPressed = false;
  if (!mouseData.leftCurrentlyPressed) return;
  if (!mouseData.pos || !mouseData.leftPressedAt) return;
  const width = mouseData.pos.x * canvasDrawFractions.x - mouseData.leftPressedAt.x * canvasDrawFractions.x;
  const height = mouseData.pos.y * canvasDrawFractions.y - mouseData.leftPressedAt.y * canvasDrawFractions.y;
  return { width, height };
};

export default getSelectionBoxSize;