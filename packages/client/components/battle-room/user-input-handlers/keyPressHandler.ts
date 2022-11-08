import { Socket } from "socket.io-client";
import { BattleRoomGame, PlayerRole, Point, SelectOrbAndAssignDestination, simulatedLagMs, SocketEventsFromClient } from "../../../../common";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
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
    case "0":
      keyPressed = 0;
      break;
    default:
      return;
  }
  if (keyPressed === 0) currentGame.debug.showDebug = !currentGame.debug.showDebug;
  if (keyPressed < 1 || keyPressed > 5) return;
  const { mouseData } = currentGame;

  const input = new SelectOrbAndAssignDestination(
    {
      orbLabels: [`${playerRole}-orb-${keyPressed - 1}`],
      mousePosition: new Point(mouseData.position?.x || 0, mouseData.position?.y || 0),
    },
    currentGame.currentTick,
    (currentGame.lastClientInputNumber += 1),
    playerRole
  );
  currentGame.queues.client.localInputs.push(input);
  // socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input))
  laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
};
