import { BattleRoomGame } from "../../../../common";
import { Point } from "../../../../common";
import { WidthAndHeight } from "../../../../common";

export default (
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  currentGame: BattleRoomGame,
  canvasSize: WidthAndHeight
) => {
  const { mouseData } = currentGame;
  if (!mouseData) return;
  if (!mouseData.position) mouseData.position = new Point(0, 0);
  mouseData.position.x = (e.nativeEvent.offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width;
  mouseData.position.x = (e.nativeEvent.offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height;
};
