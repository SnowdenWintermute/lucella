/* eslint-disable no-param-reassign */
import { Socket } from "socket.io-client";
import { BattleRoomGame, AssignOrbDestinations, PlayerRole, Point, SelectOrbs, SocketEventsFromClient, simulatedLagMs, simulateLag } from "../../../../common";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
import newOrbSelections from "../game-functions/commandHandlers/newOrbSelections";
import serializeInput from "../user-input-serializers/serialize-input";
// const replicator = new (require("replicator"))();

export default function mouseUpHandler(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  currentGame: BattleRoomGame,
  socket: Socket,
  playerRole: PlayerRole | null
) {
  if (!(e.button === 0 || e.button === 2) || !playerRole) return;
  const { mouseData } = currentGame;
  if (!mouseData || !mouseData.position) return;
  let input;
  if (e.button === 2) {
    mouseData.rightReleasedAt = new Point(mouseData.position.y, mouseData.position.x);
    input = new AssignOrbDestinations(
      { mousePosition: new Point(mouseData.position.x, mouseData.position.y) },
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    input = new SelectOrbs({ orbIds: newOrbSelections(mouseData, currentGame, playerRole) }, (currentGame.netcode.lastClientInputNumber += 1), playerRole);
  }
  if (!input) return;
  currentGame.queues.client.localInputs.push(input);
  const serialized = serializeInput(input);
  if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, serialized, simulatedLagMs);
  else socket.emit(SocketEventsFromClient.NEW_INPUT, serialized);
}
