import { Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import { PlayerRole, GameRoom, SocketMetadata } from "@lucella/common";

// old - delete

export default function (socket: Socket, connectedSockets: { [sockedId: string]: SocketMetadata }, gameRoom: GameRoom) {
  if (!gameRoom.players.host) {
    gameRoom.players.host = connectedSockets[socket.id];
    return PlayerRole.HOST;
  } else if (!gameRoom.players.challenger) {
    gameRoom.players.challenger = connectedSockets[socket.id];
    return PlayerRole.CHALLENGER;
  }
}
