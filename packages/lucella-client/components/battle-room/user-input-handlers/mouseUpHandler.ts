import { BattleRoomGame } from "../../../../common/src/classes/BattleRoomGame";
import { UserInput } from "../../../../common/src/classes/UserInput";
const GameEventTypes = require("../../../../common/src/consts/GameEventTypes");

export default (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, currentGame: BattleRoomGame) => {
  if (!(e.button === 0 || e.button === 2)) return;
  const { mouseData } = currentGame;
  let type, data;
  if (!mouseData) return;
  if (!mouseData.position || !mouseData.rightReleasedAt || !mouseData.leftReleasedAt || !mouseData.leftPressedAt)
    return;
  if (e.button === 2) {
    mouseData.rightReleasedAt.y = mouseData.position.y;
    mouseData.rightReleasedAt.x = mouseData.position.x;
    type = GameEventTypes.ORB_MOVE;
    data = {
      headingX: mouseData.rightReleasedAt.x,
      headingY: mouseData.rightReleasedAt.y,
    };
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt.x = mouseData.position.x;
    mouseData.leftReleasedAt.y = mouseData.position.y;
    type = GameEventTypes.ORB_SELECT;
    data = {
      headingX: mouseData.rightReleasedAt.x,
      headingY: mouseData.rightReleasedAt.y,
      startX: mouseData.leftPressedAt.x,
      startY: mouseData.leftPressedAt.y,
      currX: mouseData.position.x,
      currY: mouseData.position.y,
    };
  }
};
