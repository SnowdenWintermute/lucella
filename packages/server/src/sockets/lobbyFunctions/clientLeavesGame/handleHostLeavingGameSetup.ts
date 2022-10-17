import { ChatMessage } from "../../../../../common";
import { Server } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import removeNonHostPlayers from "./removeNonHostPlayers";
import { SocketEventsFromServer } from "../../../../../common";

export default function (io: Server, serverState: ServerState, gameName: string) {
  const { gameRooms } = serverState;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  io.to(`game-${gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
  io.to(`game-${gameName}`).emit(SocketEventsFromServer.GAME_CLOSED_BY_HOST, null);
  io.to(`game-${gameName}`).emit(
    SocketEventsFromServer.NEW_CHAT_MESSAGE,
    new ChatMessage("Server", `Game ${gameName} closed by host.`, "private")
  );
  removeNonHostPlayers(io, serverState, players);
  players.host = null;
  players.challenger = null;
}
