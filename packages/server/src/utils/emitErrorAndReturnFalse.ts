import { Socket } from "socket.io";
import { SocketEventsFromServer } from "../../../common";

export default function emitErrorAndReturnFalse(socket: Socket, errorMessage: string) {
  socket.emit(SocketEventsFromServer.ERROR_MESSAGE, errorMessage);
  return false;
}
