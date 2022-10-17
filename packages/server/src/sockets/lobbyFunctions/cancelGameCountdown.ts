import { GameStatus, GameRoom, SocketEventsFromServer } from "../../../../common";
import { Server } from "socket.io";

export default function (io: Server, gameRoom: GameRoom) {
  if (!gameRoom.countdownInterval) return new Error("There is no countdown to cancel");
  gameRoom.gameStatus = GameStatus.IN_LOBBY;
  io.to(`game-${gameRoom.gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
  clearInterval(gameRoom.countdownInterval);
  gameRoom.countdown.current = gameRoom.countdown.duration; // need to reset because it might have changed if someone started then cancelled ready
  io.to(`game-${gameRoom.gameName}`).emit(
    SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE,
    gameRoom.countdown.current
  );
}
