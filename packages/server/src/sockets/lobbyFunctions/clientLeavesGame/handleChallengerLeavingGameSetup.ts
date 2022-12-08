import { Server, Socket } from "socket.io";
import { SocketEventsFromServer, SocketMetadata } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";

import cancelGameCountdown from "../cancelGameCountdown";

// old - delete

export default function (
  io: Server,
  socket: Socket,
  serverState: ServerState,
  gameName: string,
  players: {
    host: SocketMetadata | null;
    challenger: SocketMetadata | null;
  }
) {
  const { gameRooms } = serverState;
  const gameRoom = gameRooms[gameName];
  players.challenger = null;
  socket.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
  cancelGameCountdown(io, gameRoom);
  gameRoom.playersReady = { host: false, challenger: false };
  io.in(`game-${gameName}`).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, gameRoom.playersReady);
}
