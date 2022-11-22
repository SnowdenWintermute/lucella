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
import serializeInput from "../user-input-serializers/serialize-input";
const replicator = new (require("replicator"))();

export default (e: KeyboardEvent, game: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) => {
  if (!playerRole) return;
  const keyPressed = parseInt(e.key);
  if ((keyPressed < 1 || keyPressed > 7) && keyPressed !== 0) return;
  const { mouseData } = game;
  if (!mouseData.position) return;

  let input;
  if (keyPressed === 0) game.debug.mode = game.debug.mode < 2 ? game.debug.mode + 1 : 0;
  else if (keyPressed >= 1 && keyPressed <= 5)
    input = new SelectOrbAndAssignDestination(
      {
        orbLabels: [`${playerRole}-orb-${keyPressed - 1}`],
        mousePosition: new Point(mouseData.position.x, mouseData.position.y),
      },
      (game.netcode.lastClientInputNumber += 1),
      playerRole
    );
  else if (keyPressed === 7) input = new LineUpOrbsHorizontallyAtMouseY(mouseData.position.y, (game.netcode.lastClientInputNumber += 1), playerRole);
  else if (keyPressed === 6) input = new SelectOrbs({ orbLabels: Object.keys(game.orbs[playerRole]) }, (game.netcode.lastClientInputNumber += 1), playerRole);
  if (!input) return;
  const serialized = serializeInput(input);
  game.queues.client.localInputs.push(input);

  if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
  else socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));
};
