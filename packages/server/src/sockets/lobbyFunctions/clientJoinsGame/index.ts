import clientRequestsToJoinChatChannel from "../clientRequestsToJoinChatChannel";
import sanitizeGameRoomForClient from "../../../utils/sanitizeGameRoomForClient";
import sanitizeGameRoomsForClient from "../../../utils/sanitizeGameRoomsForClient";
import assignPlayerRole from "./assignPlayerRole";
import ServerState from "../../../interfaces/ServerState";
import { Server, Socket } from "socket.io";
import { SocketEventsFromServer } from "../../../../../common";

export default function (io: Server, socket: Socket | undefined, serverState: ServerState, gameName: string) {
  const { connectedSockets, gameRooms } = serverState;
  if (!socket) return new Error("client tried to join a game but their socket wasn't found");
  const username = connectedSockets[socket.id].associatedUser.username;
  const gameRoom = gameRooms[gameName];
  try {
    if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "No game by that name exists");
    if (connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "You are already in a game");
    if (gameRoom.players.host && gameRoom.players.challenger) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "That game is currently full");
    if (gameRoom.players.host && gameRoom.players.host.associatedUser.username === username)
      return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "You can not join a game hosted by yourself");
    const playerRole = assignPlayerRole(socket, serverState, gameRoom);
    socket.emit(SocketEventsFromServer.PLAYER_ROLE_ASSIGNMENT, playerRole);
    clientRequestsToJoinChatChannel(io, socket, serverState, `game-${gameName}`, true);
    connectedSockets[socket.id].currentGameName = gameName;
    io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, sanitizeGameRoomsForClient(gameRooms));
    io.to(`game-${gameName}`).emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, sanitizeGameRoomForClient(gameRoom));
  } catch (error) {
    console.log(error);
  }
}
