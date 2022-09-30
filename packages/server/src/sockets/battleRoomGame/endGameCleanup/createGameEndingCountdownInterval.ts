import { EloUpdates } from "../../../../../common";
import { Server } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import sendPlayerBackToLobby from "./sendPlayerBackToLobby";

export default function (io: Server, serverState: ServerState, gameName: string, eloUpdates: EloUpdates | null) {
  const { connectedSockets, gameRooms, games } = serverState;
  const gameRoom = gameRooms[gameName];
  const game = games[gameName];
  // if (!game) return new Error("tried to create game ending countdown interval but no game was fonud");
  return setInterval(() => {
    if (!game.gameOverCountdown.current) game.gameOverCountdown.current = game.gameOverCountdown.duration;
    if (game.gameOverCountdown.current < 1) {
      if (game.intervals.endingCountdown) clearInterval(game.intervals.endingCountdown);
      const host = connectedSockets[gameRoom.players.host!.socketId!];
      const challenger = gameRoom.players.challenger ? connectedSockets[gameRoom.players.challenger.socketId!] : null;
      io.in(`game-${gameName}`).emit("showEndScreen", {
        gameRoom,
        game,
        eloUpdates,
      });
      io.in(`game-${gameName}`).emit("currentGameRoomUpdate", null);
      sendPlayerBackToLobby(io, serverState, gameRoom.players.host!.socketId!, host);
      sendPlayerBackToLobby(io, serverState, gameRoom.players.challenger!.socketId!, challenger);
      delete games[gameName];
      delete gameRooms[gameName];
      io.sockets.emit("gameListUpdate", gameRooms);
    } else {
      game.gameOverCountdown.current -= 1;
      io.to(`game-${gameName}`).emit("gameEndingCountdown", game.gameOverCountdown.current);
    }
  }, 1000);
}
