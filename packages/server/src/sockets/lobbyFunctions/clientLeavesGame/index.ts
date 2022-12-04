import { GameStatus, SocketEventsFromServer } from "../../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

import endGameCleanup from "../../battleRoomGame/endGameCleanup";
import handleLeavingGameSetupScreen from "./handleLeavingGameSetupScreen";
import sanitizeGameRoomsForClient from "../../../utils/sanitizeGameRoomsForClient";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string, isDisconnecting?: boolean) {
  const { connectedSockets, gameRooms } = serverState;
  const gameName_lc = gameName.toLowerCase();
  const gameRoom = gameRooms[gameName_lc];
  if (!gameRoom) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "No game by that name exists");
  if (!isDisconnecting && !connectedSockets[socket.id].currentGameName) return console.log("tried to leave a game when they weren't in one");

  try {
    if (gameRoom.gameStatus === GameStatus.IN_LOBBY || gameRoom.gameStatus === GameStatus.COUNTING_DOWN)
      handleLeavingGameSetupScreen(io, socket, serverState, gameName_lc, isDisconnecting);
    else endGameCleanup(io, socket, serverState, gameName_lc, isDisconnecting);
    io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, sanitizeGameRoomsForClient(gameRooms));
  } catch (error) {
    console.log(error);
  }
}
