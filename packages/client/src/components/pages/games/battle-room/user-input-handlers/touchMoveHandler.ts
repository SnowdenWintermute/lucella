import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { Point } from "@lucella/common/battleRoomGame/classes/Point";
import {
  minimumQuickTouchSelectionBoxSize,
  touchHoldSelectionBoxStartThreshold,
} from "@lucella/common/battleRoomGame/consts";
import { WidthAndHeight } from "@lucella/common/battleRoomGame/types";
import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

export default throttledEventHandlerCreator(
  33,
  (e: React.TouchEvent<HTMLCanvasElement>, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) => {
    const { mouseData } = currentGame;
    e.preventDefault();
    const { touchStart } = mouseData;
    const node = e.target as HTMLElement;
    const rect = node.getBoundingClientRect();
    const offsetX = e.targetTouches[0].pageX - rect.left;
    const offsetY = e.targetTouches[0].pageY - rect.top;
    mouseData.position = new Point(
      (offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width,
      (offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height
    );
    const touchLength = mouseData.touchStartTime ? Date.now() - mouseData.touchStartTime : 0;
    if (
      touchLength > touchHoldSelectionBoxStartThreshold ||
      Math.abs(offsetX - (touchStart?.x || 0)) > minimumQuickTouchSelectionBoxSize ||
      Math.abs(offsetY - (touchStart?.y || 0)) > minimumQuickTouchSelectionBoxSize
    ) {
      mouseData.leftCurrentlyPressed = true;
    }
  }
);