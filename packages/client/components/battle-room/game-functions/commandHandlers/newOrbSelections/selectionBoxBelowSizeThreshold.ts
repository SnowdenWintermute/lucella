/* eslint-disable consistent-return */
import { minimumSelectionBoxSize, MouseData } from "../../../../../../common";

export default function selectionBoxBelowSizeThreshold(mouseData: MouseData) {
  const { position, leftPressedAt } = mouseData;
  if (!position || !leftPressedAt) return;
  const selectionBoxIsBelowSizeThreshold =
    Math.abs(position.x - leftPressedAt.x) < minimumSelectionBoxSize && Math.abs(position.y - leftPressedAt.y) < minimumSelectionBoxSize;

  return selectionBoxIsBelowSizeThreshold;
}
