import { BattleRoomGame, KeyPress, PlayerRole } from "../../../../common";

export default (e: KeyboardEvent, currentGame: BattleRoomGame, playerRole: PlayerRole | null) => {
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
    const input = new KeyPress({ keyPressed, mousePosition: currentGame.mouseData.position });
    currentGame.queues.client.localInputs.push(input);
    currentGame.queues.client.inputsToSend.push(input);
  }
};
