import selectOrbAndIssueMoveCommand from "../game-functions/selectOrbAndIssueMoveCommand";
import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

export default throttledEventHandlerCreator(33, ({ e, commonEventHandlerProps }) => {
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
  if (keyPressed > 0 && keyPressed < 6) { selectOrbAndIssueMoveCommand({ keyPressed, commonEventHandlerProps }); }
},
);