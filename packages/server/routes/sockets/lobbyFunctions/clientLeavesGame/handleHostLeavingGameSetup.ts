import { Server } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";

const removeNonHostPlayers = require("./removeNonHostPlayers");
const ChatMessage = require("../../../../classes/chat/ChatMessage");

export default function (io: Server, serverState: ServerState, gameName: string) {
  const { gameRooms } = serverState;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  io.to(`game-${gameName}`).emit("currentGameRoomUpdate", null);
  io.to(`game-${gameName}`).emit("gameClosedByHost", null);
  io.to(`game-${gameName}`).emit(
    "newMessage",
    new ChatMessage({
      author: "Server",
      style: "private",
      messageText: `Game ${gameName} closed by host.`,
    })
  );
  removeNonHostPlayers({ serverState, players });
  players.host = null;
  players.challenger = null;
}
