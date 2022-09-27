import { BattleRoomGame } from "../../../../common";
import { Point } from "../../../../common/Point";
import { WidthAndHeight } from "../../../../common";
import throttledEventHandlerCreator from "../../../util-functions/throttledEventHandlerCreator";

export default throttledEventHandlerCreator(
  33,
  (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) => {
    const { mouseData } = currentGame;
    if (!mouseData) return;
    if (!mouseData.position) mouseData.position = new Point(0, 0);
    mouseData.position.x = (e.nativeEvent.offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width;
    mouseData.position.x = (e.nativeEvent.offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height;
  }
);
