import { Socket } from "socket.io-client";
import { BattleRoomGame, LeftMouseDown, MouseData, Point, SocketEventsFromClient } from "../../../../common";

export default function mouseDownHandler(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  currentGame: BattleRoomGame,
  socket: Socket
) {
  if (!(e.button === 0)) return;
  const { mouseData } = currentGame;
  mouseData.leftCurrentlyPressed = true;
  if (!mouseData.position) return;
  const { x, y } = mouseData.position;
  if (!mouseData.leftPressedAt) mouseData.leftPressedAt = new Point(x, y);
  mouseData.leftPressedAt.x = x;
  mouseData.leftPressedAt.y = y;
  const input = new LeftMouseDown({ mousePosition: mouseData.position }, currentGame.currentTick);
  currentGame.queues.client.localInputs.push(input);
  socket.emit(SocketEventsFromClient.NEW_INPUT, JSON.stringify(input));
}
