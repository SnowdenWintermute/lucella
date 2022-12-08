import { GameStatus, GameRoom, SocketEventsFromServer } from "../../../../common";
import { Server } from "socket.io";

// old - delete

export default function (io: Server, gameRoom: GameRoom) {
  gameRoom.cancelCountdownInterval();
  io.to(`game-${gameRoom.gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
  io.to(`game-${gameRoom.gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, gameRoom.countdown.current);
}
