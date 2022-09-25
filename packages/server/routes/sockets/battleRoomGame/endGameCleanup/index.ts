import updateGameRecords from "./updateGameRecords";
import handleDisconnectionFromGame from "./handleDisconnectionFromGame";
import setGameRoomWinnerName from "./setGameRoomWinnerName";
import createGameEndingCountdownInterval from "./createGameEndingCountdownInterval";
import { GameStatus } from "../../../../../common/enums";
import ServerState from "../../../../interfaces/ServerState";
import { Server, Socket } from "socket.io";

export default async function endGameCleanup(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  gameName: string,
  isDisconnecting?: boolean
) {
  const gameRoom = serverState.gameRooms[gameName];
  const game = serverState.games[gameName];
  if (gameRoom.gameStatus === GameStatus.ENDING) return;
  gameRoom.gameStatus = GameStatus.ENDING;
  io.in(`game-${gameName}`).emit("currentGameStatusUpdate", gameRoom.gameStatus);
  io.to(`game-${gameName}`).emit("gameEndingCountdown", game.gameOverCountdown.current);
  if (game.intervals.physics) clearInterval(game.intervals.physics);
  if (game.intervals.broadcast) clearInterval(game.intervals.broadcast);
  if (isDisconnecting) setGameRoomWinnerName(gameRoom, game);
  else handleDisconnectionFromGame(io, socket, serverState, gameName);

  const loser =
    gameRoom.winner === gameRoom.players.host?.associatedUser.username
      ? gameRoom.players.challenger?.associatedUser.username
      : gameRoom.players.host?.associatedUser.username;

  let eloUpdates;
  if (!gameRoom.winner || !loser)
    throw new Error("Tried to update game records but either winner or loser wasn't found");
  else eloUpdates = await updateGameRecords(gameRoom.winner, loser, gameRoom, game, gameRoom.isRanked);

  io.in(`game-${gameName}`).emit("serverSendsWinnerInfo", gameRoom.winner);
  game.intervals.endingCountdown = createGameEndingCountdownInterval(io, serverState, gameName, eloUpdates);
}
