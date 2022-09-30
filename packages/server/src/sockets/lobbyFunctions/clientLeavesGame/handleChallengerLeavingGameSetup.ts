import { Server, Socket } from "socket.io";
import { SocketMetadata } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";

import cancelGameCountdown from "../cancelGameCountdown";

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
  socket.emit("currentGameRoomUpdate", null);
  cancelGameCountdown(io, gameRoom);
  gameRoom.playersReady = { host: false, challenger: false };
  io.in(`game-${gameName}`).emit("updateOfcurrentChatChannelPlayerReadyStatus", gameRoom.playersReady);
}
