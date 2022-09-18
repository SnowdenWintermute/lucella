import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { UserInput, UserInputs } from "@lucella/common/battleRoomGame/classes/UserInput";
import { eventLimiterRate } from "@lucella/common/battleRoomGame/consts";
import { PlayerRole } from "@lucella/common/battleRoomGame/enums";
import throttledEventHandlerCreator from "../../util-functions/throttledEventHandlerCreator";

export default throttledEventHandlerCreator(
  eventLimiterRate,
  (e: React.KeyboardEvent<HTMLDivElement>, currentGame: BattleRoomGame, playerRole: PlayerRole) => {
    let keyPressed;
    switch (e.key) {
      case "1": // 1
        keyPressed = 1;
        break;
      case "2": // 2
        keyPressed = 2;
        break;
      case "3": // 3
        keyPressed = 3;
        break;
      case "4": // 4
        keyPressed = 4;
        break;
      case "5": // 5
        keyPressed = 5;
        break;
      default:
        return;
    }
    if (keyPressed > 0 && keyPressed < 6) {
      const input = new UserInput(UserInputs.SELECT_ORB, {});
      currentGame.queues.client.localInputs.push(input);
      currentGame.queues.client.inputsToSend.push(input);
    }
  }
);
