import { Socket } from "socket.io-client";
import { BattleRoomGame, MouseLeave, Point, SocketEventsFromClient } from "../../../../common";

export default function mouseLeaveHandler(currentGame: BattleRoomGame, socket: Socket) {
  const { mouseData } = currentGame;
  if (!mouseData || !mouseData.position) return;
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    const input = new MouseLeave({ mousePosition: mouseData.position }, currentGame.currentTick);
    currentGame.queues.client.localInputs.push(input);
    socket.emit(SocketEventsFromClient.NEW_INPUT, JSON.stringify(input));
  }
}
