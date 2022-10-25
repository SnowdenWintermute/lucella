import { BattleRoomGame, PlayerRole, SocketEventsFromClient } from "@lucella/common";
import { Socket } from "socket.io-client";

export default function createClientBroadcastInterval(
  socket: Socket,
  game: BattleRoomGame,
  playerRole: PlayerRole | null
) {
  return setInterval(() => {
    socket.emit(SocketEventsFromClient.CURRENT_TICK_NUMBER, { playerRole, tick: game.currentTick });
  });
}
