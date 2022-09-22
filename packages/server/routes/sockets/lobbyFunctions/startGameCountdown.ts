import { GameStatus } from "@lucella/common/battleRoomGame/enums";
import { Server } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import startGame from "../battleRoomGame/startGame";

export default function startGameCountdown(io: Server, serverState: ServerState, gameName: string) {
  const { gameRooms } = serverState;
  const gameRoom = gameRooms[gameName];
  gameRoom.gameStatus = GameStatus.COUNTING_DOWN;
  io.to(`game-${gameRoom.gameName}`).emit("currentGameStatusUpdate", gameRoom.gameStatus);
  gameRoom.countdownInterval = setInterval(() => {
    if (gameRoom.countdown.current === 0) {
      gameRoom.gameStatus = GameStatus.IN_PROGRESS;
      io.to(`game-${gameRoom.gameName}`).emit("currentGameStatusUpdate", gameRoom.gameStatus);
      startGame(io, serverState, gameName);
      gameRoom.countdownInterval && clearInterval(gameRoom.countdownInterval);
      return;
    }
    gameRoom.countdown.current--;
    io.to(`game-${gameRoom.gameName}`).emit("currentGameCountdownUpdate", gameRoom.countdown);
  }, 1000);
}
