import { SocketEventsFromClient, SocketEventsFromServer } from "../../common";
import { Socket } from "socket.io-client";

export default function (
  socket: Socket,
  event: SocketEventsFromClient | SocketEventsFromServer,
  data: any,
  lagMs: number
) {
  setTimeout(() => socket.emit(event, data), lagMs);
}
