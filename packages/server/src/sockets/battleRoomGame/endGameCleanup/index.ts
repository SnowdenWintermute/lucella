// import updateGameRecords from "./updateGameRecords";
import handleDisconnectionFromGame from "./handleDisconnectionFromGame";
import setGameRoomWinnerName from "./setGameRoomWinnerName";
import createGameEndingCountdownInterval from "./createGameEndingCountdownInterval";
import ServerState from "../../../interfaces/ServerState";
import { Server, Socket } from "socket.io";
import { GameStatus, SocketEventsFromServer, EloUpdates } from "../../../../../common";
const replicator = new (require("replicator"))();

// old - delete (from handlePlayerLeavingGame)

export default async function endGameCleanup(io: Server, socket: Socket, serverState: ServerState, gameName: string, isDisconnecting?: boolean) {
  const gameRoom = serverState.gameRooms[gameName];
  const game = serverState.games[gameName];
  if (gameRoom.gameStatus === GameStatus.ENDING) return;
  gameRoom.gameStatus = GameStatus.ENDING;
  io.in(`game-${gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
  io.to(`game-${gameName}`).emit(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, game.gameOverCountdown.current);
  if (game.intervals.physics) clearInterval(game.intervals.physics);
  // @ todo - change this to a score only broadcast
  // io.to(`game-${gameName}`).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, replicator.encode(game)); // since we stop the broadcast interval we need one last snapshot to show the winning point
  if (!isDisconnecting) setGameRoomWinnerName(gameRoom, game);
  else handleDisconnectionFromGame(io, socket, serverState, gameName);

  const loser =
    gameRoom.winner === gameRoom.players.host?.associatedUser.username
      ? gameRoom.players.challenger?.associatedUser.username
      : gameRoom.players.host?.associatedUser.username;

  let eloUpdates: EloUpdates | null = null;
  if (!gameRoom.winner || !loser) throw new Error("Tried to update game records but either winner or loser wasn't found");
  // else eloUpdates = await updateGameRecords(gameRoom.winner, loser, gameRoom, game, gameRoom.isRanked);

  io.in(`game-${gameName}`).emit(SocketEventsFromServer.NAME_OF_GAME_WINNER, gameRoom.winner);
  game.intervals.endingCountdown = createGameEndingCountdownInterval(io, serverState, gameName, eloUpdates);
}
