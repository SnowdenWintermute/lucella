import { PlayerRole } from "../../../../../../common";
import { Socket } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";

export default function (socket: Socket, serverState: ServerState, gameName: string) {
  const { connectedSockets, gameRooms } = serverState;
  const socketUuid = connectedSockets[socket.id].uuid;
  if (socketUuid === gameRooms[gameName].players.host?.uuid) return PlayerRole.HOST;
  else if (socketUuid === gameRooms[gameName].players.challenger?.uuid) return PlayerRole.CHALLENGER;
  else return null;
}
