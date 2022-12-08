import { BattleRoomGame, EloUpdates, SocketEventsFromServer } from "../../../../../common";
import { Server } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import sendPlayerBackToLobby from "./sendPlayerBackToLobby";
import sanitizeGameRoomsForClient from "../../../classes/LobbyManager/sanitizeGameRoomsForClient";
const replicator = new (require("replicator"))();

// old - delete

export default function (io: Server, serverState: ServerState, gameName: string, eloUpdates: EloUpdates | null) {
  const { connectedSockets, gameRooms, games } = serverState;
  const gameRoom = gameRooms[gameName];
  const game = games[gameName];
  // if (!game) return new Error("tried to create game ending countdown interval but no game was fonud");
  game.gameOverCountdown.current = game.gameOverCountdown.duration;
  return setInterval(() => {
    if (game.gameOverCountdown.current! < 1) {
      if (game.intervals.endingCountdown) clearInterval(game.intervals.endingCountdown);
      const host = connectedSockets[gameRoom.players.host!.socketId!];
      const challenger = gameRoom.players.challenger ? connectedSockets[gameRoom.players.challenger.socketId!] : null;
      // @todo - delta packet this end screen data
      io.in(`game-${gameName}`).emit(SocketEventsFromServer.SHOW_END_SCREEN, {
        gameRoom,
        game: replicator.encode(new BattleRoomGame("test")),
        eloUpdates,
      });
      io.in(`game-${gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);

      if (!player) return new Error("tried to send player back to lobby but no player found");
      if (!socketId) return new Error("tried to send player back to lobby but no sockedId found");
      console.log("sending player back to lobby: ", player);
      const { connectedSockets } = serverState;
      player.currentGameName = null;
      const socketToSend = io.sockets.sockets.get(socketId);
      if (socketToSend) clientRequestsToJoinChatChannel(io, socketToSend, serverState, connectedSockets[socketId].previousChatChannelName);
      else throw new Error("tried to send player back to lobby but their socket id wasn't registered with the io server");

      sendPlayerBackToLobby(io, serverState, gameRoom.players.host!.socketId!, host);
      sendPlayerBackToLobby(io, serverState, gameRoom.players.challenger!.socketId!, challenger);
      delete games[gameName];
      delete gameRooms[gameName];
      io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, sanitizeGameRoomsForClient(gameRooms));
    } else {
      game.gameOverCountdown.current! -= 1;
      io.to(`game-${gameName}`).emit(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, game.gameOverCountdown.current);
    }
  }, 1000);
}
