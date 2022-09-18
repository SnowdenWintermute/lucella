import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";

const handleAndQueueNewGameEvent = require("../game-functions/queueInput");
const GameEventTypes = require("@lucella/common/battleRoomGame/consts/GameEventTypes");

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
