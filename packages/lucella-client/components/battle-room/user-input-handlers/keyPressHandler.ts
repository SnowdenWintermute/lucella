import { Socket } from "socket.io-client";
import {
  BattleRoomGame,
  PlayerRole,
  Point,
  SelectOrbAndAssignDestination,
  SocketEventsFromClient,
} from "../../../../common";
const replicator = new (require("replicator"))();

export default (e: KeyboardEvent, currentGame: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) => {
  if (!playerRole) return;
  let keyPressed;
  switch (e.key) {
    case "1":
      keyPressed = 1;
      break;
    case "2":
      keyPressed = 2;
      break;
    case "3":
      keyPressed = 3;
      break;
    case "4":
      keyPressed = 4;
      break;
    case "5":
      keyPressed = 5;
      break;
    default:
      return;
  }
  if (keyPressed < 1 || keyPressed > 5) return;
  const { mouseData } = currentGame;

  const input = new SelectOrbAndAssignDestination(
    {
      orbIds: [keyPressed],
      mousePosition: new Point(mouseData.position?.x || 0, mouseData.position?.y || 0),
      playerRole,
    },
    currentGame.currentTick
  );
  currentGame.queues.client.localInputs.push(input);
  setTimeout(() => socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input)), 500);
};
