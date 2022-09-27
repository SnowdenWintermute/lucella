import { BattleRoomGame } from "../../../../common";
import { Point } from "../../../../common/Point";
import { minimumQuickTouchSelectionBoxSize, touchHoldSelectionBoxStartThreshold } from "../../../../common";
import { WidthAndHeight } from "../../../../common";

const GameEventTypes = require("../../../../common/GameEventTypes");

export default (e: React.TouchEvent<HTMLCanvasElement>, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) => {
  const { mouseData } = currentGame;
  mouseData.leftCurrentlyPressed = false;
  const { touchStart, touchStartTime } = mouseData;
  if (!(touchStart && touchStartTime)) return;
  const node = e.target as HTMLElement;
  const rect = node.getBoundingClientRect();
  const offsetX = e.changedTouches[0].pageX - rect.left;
  const offsetY = e.changedTouches[0].pageY - rect.top;

  const adjustedOffsetX = (offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width;
  const adjustedOffsetY = (offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height;

  mouseData.leftReleasedAt = new Point(adjustedOffsetX, adjustedOffsetY);

  const touchLength = Date.now() - touchStartTime;
  let type, props;
  if (
    touchLength > touchHoldSelectionBoxStartThreshold ||
    Math.abs(adjustedOffsetX - touchStart.x) > minimumQuickTouchSelectionBoxSize ||
    Math.abs(adjustedOffsetY - touchStart.y) > minimumQuickTouchSelectionBoxSize
  ) {
    type = GameEventTypes.ORB_SELECT;
    if (!mouseData.position) return;
    props = {
      startX: touchStart.x,
      startY: touchStart.y,
      currX: mouseData.position.x,
      currY: mouseData.position.y,
    };
  } else {
    type = GameEventTypes.ORB_MOVE;
    props = {
      headingX: (offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width,
      headingY: (offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height,
    };
  }
  // queue input
};
