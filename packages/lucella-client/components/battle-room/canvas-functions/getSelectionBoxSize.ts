import MouseData from "../../../../common/src/classes/MouseData";
import { Point } from "../../../../common/src/classes/Point";

const getSelectionBoxSize = (mouseData: MouseData, canvasDrawFractions: Point) => {
  if (!mouseData.mouseOnScreen) mouseData.leftCurrentlyPressed = false;
  if (!mouseData.leftCurrentlyPressed) return;
  if (!mouseData.position || !mouseData.leftPressedAt) return;
  const width = mouseData.position.x * canvasDrawFractions.x - mouseData.leftPressedAt.x * canvasDrawFractions.x;
  const height = mouseData.position.y * canvasDrawFractions.y - mouseData.leftPressedAt.y * canvasDrawFractions.y;
  return { width, height };
};

export default getSelectionBoxSize;
