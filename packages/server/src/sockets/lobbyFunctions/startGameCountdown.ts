import { GameStatus, SocketEventsFromServer } from "../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import startGame from "../battleRoomGame/startGame";

export default function startGameCountdown(io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const { gameRooms } = serverState;
  const gameRoom = gameRooms[gameName];
  gameRoom.gameStatus = GameStatus.COUNTING_DOWN;
  io.to(`game-${gameRoom.gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
  gameRoom.countdownInterval = setInterval(() => {
    if (gameRoom.countdown.current === 0) {
      gameRoom.gameStatus = GameStatus.IN_PROGRESS;
      io.to(`game-${gameRoom.gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
      startGame(io, socket, serverState, gameName);
      gameRoom.countdownInterval && clearInterval(gameRoom.countdownInterval);
      return;
    }
    gameRoom.countdown.current--;
    io.to(`game-${gameRoom.gameName}`).emit(
      SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE,
      gameRoom.countdown.current
    );
  }, 1000);
}
