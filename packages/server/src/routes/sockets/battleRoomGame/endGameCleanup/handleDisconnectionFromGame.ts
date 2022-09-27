import { Server, Socket } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";
import removeSocketFromChatChannel from "../../lobbyFunctions/removeSocketFromChatChannel";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const { connectedSockets, gameRooms } = serverState;
  const gameRoom = gameRooms[gameName];
  const userThatDisconnected = connectedSockets[socket.id];
  removeSocketFromChatChannel(io, socket, serverState);
  gameRoom.winner =
    (gameRoom.players.host?.associatedUser.username === userThatDisconnected.associatedUser.username
      ? gameRoom.players.challenger?.associatedUser.username
      : gameRoom.players.host?.associatedUser.username) || null;
}
