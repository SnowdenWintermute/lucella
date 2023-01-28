import { WidthAndHeight, Point, BattleRoomGame } from "../../../../common";

export default function mouseMoveHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, currentGame: BattleRoomGame, canvasSize: WidthAndHeight) {
  const { mouseData } = currentGame;
  if (!mouseData) return;
  if (!mouseData.position) mouseData.position = new Point(0, 0);
  console.log(
    "mouse moved: ",
    Math.round((e.nativeEvent.offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width),
    Math.round((e.nativeEvent.offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height)
  );
  mouseData.position.x = Math.round((e.nativeEvent.offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width);
  mouseData.position.y = Math.round((e.nativeEvent.offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height);
}
