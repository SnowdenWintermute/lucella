import { Socket } from "socket.io-client";
import { SocketEventsFromClient, SocketEventsFromServer } from "../../../common";

export default function laggedSocketEmit(socket: Socket, event: SocketEventsFromClient | SocketEventsFromServer, data: any, lagMs: number) {
  setTimeout(() => socket.emit(event, data), lagMs);
}
