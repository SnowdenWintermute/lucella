import { minimumSelectionBoxSize, MouseData } from "@lucella/common";

export default function (mouseData: MouseData) {
  const { position, leftPressedAt } = mouseData;
  if (!position || !leftPressedAt) return;
  const selectionBoxIsBelowSizeThreshold =
    Math.abs(position.x - leftPressedAt.x) < minimumSelectionBoxSize && Math.abs(position.y - leftPressedAt.y) < minimumSelectionBoxSize;

  return selectionBoxIsBelowSizeThreshold;
}
