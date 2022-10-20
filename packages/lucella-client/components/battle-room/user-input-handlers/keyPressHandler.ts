import { Socket } from "socket.io-client";
import { BattleRoomGame, KeyPress, SocketEventsFromClient } from "../../../../common";

export default (e: KeyboardEvent, currentGame: BattleRoomGame, socket: Socket) => {
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
    const input = new KeyPress({ keyPressed, mousePosition: currentGame.mouseData.position }, currentGame.currentTick);
    currentGame.queues.client.localInputs.push(input);
    socket.emit(SocketEventsFromClient.NEW_INPUT, JSON.stringify(input));
  }
};
