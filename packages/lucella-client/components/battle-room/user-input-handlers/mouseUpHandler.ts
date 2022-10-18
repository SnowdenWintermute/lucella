import { BattleRoomGame, Point } from "../../../../common";

export default function mouseUpHandler(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  currentGame: BattleRoomGame
) {
  if (!(e.button === 0 || e.button === 2)) return;
  const { mouseData } = currentGame;
  // let type, data;
  if (!mouseData || !mouseData.position) return;
  if (e.button === 2) {
    mouseData.rightReleasedAt = new Point(mouseData.position.y, mouseData.position.x);
    // type = GameEventTypes.ORB_MOVE;
    // data = {
    //   headingX: mouseData.rightReleasedAt.x,
    //   headingY: mouseData.rightReleasedAt.y,
    // };
  }
  if (e.button === 0) {
    console.log(currentGame);
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    // type = GameEventTypes.ORB_SELECT;
    // data = {
    //   headingX: mouseData.rightReleasedAt.x,
    //   headingY: mouseData.rightReleasedAt.y,
    //   startX: mouseData.leftPressedAt.x,
    //   startY: mouseData.leftPressedAt.y,
    //   currX: mouseData.position.x,
    //   currY: mouseData.position.y,
    // };
  }
}
