import clientRequestsToJoinChatChannel from "../clientRequestsToJoinChatChannel";
import sanitizeGameRoomForClient from "../../../../utils/sanitizeGameRoomForClient";
import sanitizeGameRoomsForClient from "../../../../utils/sanitizeGameRoomsForClient";
import assignPlayerRole from "./assignPlayerRole";
import ServerState from "../../../../interfaces/ServerState";
import { Server, Socket } from "socket.io";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const { connectedSockets, gameRooms } = serverState;
  const username = connectedSockets[socket.id].associatedUser.username;
  const gameRoom = gameRooms[gameName];
  try {
    if (!gameRoom) return socket.emit("errorMessage", "No game by that name exists");
    if (connectedSockets[socket.id].currentGameName) return socket.emit("errorMessage", "You are already in a game");
    if (gameRoom.players.host && gameRoom.players.challenger)
      return socket.emit("errorMessage", "That game is currently full");
    if (gameRoom.players.host && gameRoom.players.host.associatedUser.username === username)
      return socket.emit("errorMessage", "You can not join a game hosted by yourself");
    const playerRole = assignPlayerRole(socket, serverState, gameRoom);
    socket.emit("serverSendsPlayerRole", playerRole);
    clientRequestsToJoinChatChannel(io, socket, serverState, `game-${gameName}`, true);
    connectedSockets[socket.id].currentGameName = gameName;
    const gameRoomsForClient = sanitizeGameRoomsForClient(gameRooms);
    io.sockets.emit("gameListUpdate", gameRoomsForClient);
    const gameRoomForClient = sanitizeGameRoomForClient(gameRoom);
    io.to(`game-${gameName}`).emit("currentGameRoomUpdate", gameRoomForClient);
  } catch (error) {
    console.log(error);
  }
}
