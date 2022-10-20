import { Socket } from "socket.io-client";
import { BattleRoomGame, LeftMouseUp, Point, RightMouseUp, SocketEventsFromClient } from "../../../../common";

export default function mouseUpHandler(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  currentGame: BattleRoomGame,
  socket: Socket
) {
  if (!(e.button === 0 || e.button === 2)) return;
  const { mouseData } = currentGame;
  if (!mouseData || !mouseData.position) return;

  if (e.button === 2) {
    mouseData.rightReleasedAt = new Point(mouseData.position.y, mouseData.position.x);
    const input = new RightMouseUp({ mousePosition: mouseData.position }, currentGame.currentTick);
    currentGame.queues.client.localInputs.push(input);
    socket.emit(SocketEventsFromClient.NEW_INPUT, JSON.stringify(input));
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    const input = new LeftMouseUp({ mousePosition: mouseData.position }, currentGame.currentTick);
    currentGame.queues.client.localInputs.push(input);
    socket.emit(SocketEventsFromClient.NEW_INPUT, JSON.stringify(input));
  }
}
