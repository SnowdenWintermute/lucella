import { Socket } from "socket.io-client";
import {
  BattleRoomGame,
  LineUpOrbsHorizontallyAtMouseY,
  PlayerRole,
  Point,
  SelectOrbAndAssignDestination,
  SelectOrbs,
  simulatedLagMs,
  SocketEventsFromClient,
} from "../../../../common";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
const replicator = new (require("replicator"))();

export default (e: KeyboardEvent, currentGame: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) => {
  if (!playerRole) return;
  let keyPressed;

  keyPressed = parseInt(e.key);
  if (keyPressed === 0) currentGame.debug.showDebug = !currentGame.debug.showDebug;
  if (keyPressed < 1 || keyPressed > 7) return;
  const { mouseData } = currentGame;
  let input;
  if (keyPressed >= 1 && keyPressed <= 5)
    input = new SelectOrbAndAssignDestination(
      {
        orbLabels: [`${playerRole}-orb-${keyPressed - 1}`],
        mousePosition: new Point(mouseData.position?.x || 0, mouseData.position?.y || 0),
      },
      currentGame.netcode.currentTick,
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
  else if (keyPressed === 6)
    input = new LineUpOrbsHorizontallyAtMouseY(
      mouseData.position?.y || 0,
      currentGame.netcode.currentTick,
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
  else if (keyPressed === 7)
    input = new SelectOrbs(
      { orbLabels: Object.keys(currentGame.orbs[playerRole]) },
      currentGame.netcode.currentTick,
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
  if (!input) return;
  currentGame.queues.client.localInputs.push(input);
  // socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input))
  laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
};
