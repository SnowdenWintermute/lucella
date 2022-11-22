import { Socket } from "socket.io-client";
import { BattleRoomGame, AssignOrbDestinations, PlayerRole, Point, SelectOrbs, SocketEventsFromClient, simulatedLagMs, simulateLag } from "../../../../common";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
import newOrbSelections from "../game-functions/commandHandlers/newOrbSelections";
const replicator = new (require("replicator"))();

export default function mouseUpHandler(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  currentGame: BattleRoomGame,
  socket: Socket,
  playerRole: PlayerRole | null
) {
  if (!(e.button === 0 || e.button === 2) || !playerRole) return;
  const { mouseData } = currentGame;
  if (!mouseData || !mouseData.position) return;

  if (e.button === 2) {
    mouseData.rightReleasedAt = new Point(mouseData.position.y, mouseData.position.x);
    const input = new AssignOrbDestinations(
      { mousePosition: new Point(mouseData.position.x, mouseData.position.y) },
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
    currentGame.queues.client.localInputs.push(input);

    if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
    else socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    const input = new SelectOrbs(
      { orbLabels: newOrbSelections(mouseData, currentGame, playerRole) },
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
    currentGame.queues.client.localInputs.push(input);

    if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
    else socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));
  }
}
