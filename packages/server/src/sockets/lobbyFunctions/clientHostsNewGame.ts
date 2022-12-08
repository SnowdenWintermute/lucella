import { GameRoom, SocketEventsFromServer } from "../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";

import clientJoinsGame from "./clientJoinsGame";
import validateGameName from "../../classes/Lobby/validateGameName";
// old - delete
export default function (io: Server, socket: Socket | undefined, serverState: ServerState, gameName: string, isRanked?: boolean) {
  const { connectedSockets, gameRooms } = serverState;
  const gameName_lc = gameName.toLowerCase();
  if (!socket) return new Error("client tried to host a game but their socket wasn't found");
  if (connectedSockets[socket.id].currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "You can't host a game if you are already in one");
  if (gameRooms[gameName_lc]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "A game by that name already exists");
  const gameNameValidationError = validateGameName(gameName_lc);
  if (gameNameValidationError) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, gameNameValidationError);

  gameRooms[gameName_lc] = new GameRoom(gameName_lc, isRanked);
  clientJoinsGame(io, socket, serverState, gameName_lc);
}
