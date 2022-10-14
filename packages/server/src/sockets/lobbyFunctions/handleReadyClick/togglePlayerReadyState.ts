import { SocketMetadata } from "@lucella/common";
import { Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

export default function togglePlayerReadyState(
  socket: Socket,
  serverState: ServerState,
  players: { host: SocketMetadata | null; challenger: SocketMetadata | null },
  playersReady: { host: boolean; challenger: boolean }
) {
  const { connectedSockets } = serverState;
  if (players.host!.uuid === connectedSockets[socket.id].uuid) playersReady.host = !playersReady.host;
  else if (players.challenger!.uuid === connectedSockets[socket.id].uuid)
    playersReady.challenger = !playersReady.challenger;
}