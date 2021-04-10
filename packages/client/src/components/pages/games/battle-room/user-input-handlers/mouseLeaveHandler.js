const handleAndQueueNewGameEvent = require("../game-functions/handleAndQueueNewGameEvent");
const GameEventTypes = require('@lucella/common/battleRoomGame/consts/GameEventTypes')

export default ({ commonEventHandlerProps }) => {
  const { mouseData, } = commonEventHandlerProps
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    handleAndQueueNewGameEvent({
      type: GameEventTypes.ORB_SELECT,
      props: {
        startX: leftPressedAtX,
        startY: leftPressedAtY,
        currX: xPos,
        currY: yPos,
      },
      commonEventHandlerProps
    });
  }
};