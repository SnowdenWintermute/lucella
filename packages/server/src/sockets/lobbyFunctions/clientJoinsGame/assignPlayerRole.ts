import { Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import { GameRoom } from "../../../../../common";
import { PlayerRole } from "../../../../../common";

export default function (socket: Socket, serverState: ServerState, gameRoom: GameRoom) {
  const { connectedSockets } = serverState;
  if (!gameRoom.players.host) {
    gameRoom.players.host = connectedSockets[socket.id];
    return PlayerRole.HOST;
  } else if (!gameRoom.players.challenger) {
    gameRoom.players.challenger = connectedSockets[socket.id];
    return PlayerRole.CHALLENGER;
  }
}