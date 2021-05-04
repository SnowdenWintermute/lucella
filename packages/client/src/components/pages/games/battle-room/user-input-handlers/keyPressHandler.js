import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator"
const GameEventTypes = require('@lucella/common/battleRoomGame/consts/GameEventTypes')
const handleAndQueueNewGameEvent = require("../game-functions/handleAndQueueNewGameEvent")

export default throttledEventHandlerCreator(33, ({ e, commonEventHandlerProps }) => {
  const { mouseData } = commonEventHandlerProps
  const headingX = mouseData.xPos
  const headingY = mouseData.yPos
  let keyPressed;
  switch (e.keyCode) {
    case 49: // 1
      keyPressed = 1;
      break;
    case 50: // 2
      keyPressed = 2;
      break;
    case 51: // 3
      keyPressed = 3;
      break;
    case 52: // 4
      keyPressed = 4;
      break;
    case 53: // 5
      keyPressed = 5;
      break;
    default:
      return;
  }
  if (keyPressed > 0 && keyPressed < 6) {
    handleAndQueueNewGameEvent({ type: GameEventTypes.ORB_SELECT, props: { keyPressed }, commonEventHandlerProps })
    handleAndQueueNewGameEvent({ type: GameEventTypes.ORB_MOVE, props: { headingX, headingY }, commonEventHandlerProps })
  }
},
);