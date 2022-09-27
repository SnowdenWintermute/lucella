import { Socket } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";

export default function (
  socket: Socket,
  serverState: ServerState,
  players,
  playersReady: { host: boolean; challenger: boolean }
) {
  const { connectedSockets } = serverState;
  if (players.host.uuid === connectedSockets[socket.id].uuid) playersReady.host = !playersReady.host;
  else if (players.challenger.uuid === connectedSockets[socket.id].uuid)
    playersReady.challenger = !playersReady.challenger;
}
