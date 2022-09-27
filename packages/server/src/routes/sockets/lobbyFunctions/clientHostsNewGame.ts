import { GameRoom } from "../common/src/classes/BattleRoomGame/GameRoom";
import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

import clientJoinsGame from "./clientJoinsGame";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string, isRanked?: boolean) {
  const { connectedSockets, gameRooms } = serverState;
  if (connectedSockets[socket.id].currentGameName)
    return socket.emit("errorMessage", "You can't host a game if you are already in one");
  if (gameRooms[gameName]) return socket.emit("errorMessage", "A game by that name already exists");

  gameRooms[gameName] = new GameRoom(gameName, isRanked);
  clientJoinsGame(io, socket, serverState, gameName);
}
