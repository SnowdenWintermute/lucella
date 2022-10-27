import { BattleRoomGame, PlayerRole, SocketEventsFromClient, simulatedLagMs } from "../../../../common";
import { Socket } from "socket.io-client";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";

export default function createClientBroadcastInterval(
  socket: Socket,
  game: BattleRoomGame,
  playerRole: PlayerRole | null
) {
  return setInterval(() => {
    // socket.emit(SocketEventsFromClient.CURRENT_TICK_NUMBER, { playerRole, tick: game.currentTick });
    laggedSocketEmit(
      socket,
      SocketEventsFromClient.CURRENT_TICK_NUMBER,
      { playerRole, tick: game.currentTick },
      simulatedLagMs
    );
  });
}
