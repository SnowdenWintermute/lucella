import { Socket } from "socket.io-client";
import {
  BattleRoomGame,
  LineUpOrbsHorizontallyAtMouseY,
  PlayerRole,
  Point,
  SelectOrbAndAssignDestination,
  SelectOrbs,
  simulatedLagMs,
  simulateLag,
  SocketEventsFromClient,
} from "../../../../common";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
const replicator = new (require("replicator"))();

export default (e: KeyboardEvent, currentGame: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) => {
  if (!playerRole) return;
  const keyPressed = parseInt(e.key);
  if ((keyPressed < 1 || keyPressed > 7) && keyPressed !== 0) return;
  const { mouseData } = currentGame;
  if (!mouseData.position) return;

  let input;
  if (keyPressed === 0) currentGame.debug.mode = currentGame.debug.mode < 2 ? currentGame.debug.mode + 1 : 0;
  else if (keyPressed >= 1 && keyPressed <= 5)
    input = new SelectOrbAndAssignDestination(
      {
        orbLabels: [`${playerRole}-orb-${keyPressed - 1}`],
        mousePosition: new Point(mouseData.position.x, mouseData.position.y),
      },
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
  else if (keyPressed === 6) input = new LineUpOrbsHorizontallyAtMouseY(mouseData.position.y, (currentGame.netcode.lastClientInputNumber += 1), playerRole);
  else if (keyPressed === 7)
    input = new SelectOrbs({ orbLabels: Object.keys(currentGame.orbs[playerRole]) }, (currentGame.netcode.lastClientInputNumber += 1), playerRole);
  if (!input) return;
  currentGame.queues.client.localInputs.push(input);
  currentGame.queues.client.inputsFromLastTick.push(input);
  if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
  else socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));
};
