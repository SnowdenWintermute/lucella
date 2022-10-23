import { Socket } from "socket.io-client";
import {
  BattleRoomGame,
  AssignOrbDestinations,
  PlayerRole,
  Point,
  SelectOrbs,
  SocketEventsFromClient,
} from "../../../../common";
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
    const input = new AssignOrbDestinations({ mousePosition: mouseData.position, playerRole }, currentGame.currentTick);
    currentGame.queues.client.localInputs.push(input);
    socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    const input = new SelectOrbs(
      { orbIds: newOrbSelections(mouseData, currentGame, playerRole), playerRole },
      currentGame.currentTick
    );
    currentGame.queues.client.localInputs.push(input);
    socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));
  }
}
