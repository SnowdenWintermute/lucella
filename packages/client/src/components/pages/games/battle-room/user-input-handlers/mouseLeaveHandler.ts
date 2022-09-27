import { BattleRoomGame } from "../common/src/classes/BattleRoomGame";

const handleAndQueueNewGameEvent = require("../game-functions/queueInput");
const GameEventTypes = require("../common/src/consts/GameEventTypes");

export default (currentGame: BattleRoomGame) => {
  const { mouseData } = currentGame;
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    const { leftPressedAt, position } = mouseData;
    handleAndQueueNewGameEvent({
      type: GameEventTypes.ORB_SELECT,
      props: {
        startX: leftPressedAtX,
        startY: leftPressedAtY,
        currX: xPos,
        currY: yPos,
      },
      commonEventHandlerProps,
    });
  }
};
