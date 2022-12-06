import { GameStatus, SocketEventsFromServer } from "../../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

import endGameCleanup from "../../battleRoomGame/endGameCleanup";
import handleLeavingGameSetupScreen from "./handleLeavingGameSetupScreen";
import sanitizeGameRoomsForClient from "../../../utils/sanitizeGameRoomsForClient";

export default function (io: Server, socket: Socket, serverState: ServerState, isDisconnecting?: boolean) {
  const { connectedSockets, gameRooms } = serverState;
  const { currentGameName } = serverState.connectedSockets[socket.id];
  if (!currentGameName) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "Trying to leave a game that doesn't exist");
  const gameName_lc = currentGameName.toLowerCase();
  const gameRoom = gameRooms[gameName_lc];
  if (!gameRoom) {
    console.log("client tried to leave a game that doesn't exist");
    return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "No game by that name exists");
  }
  if (!isDisconnecting && !connectedSockets[socket.id].currentGameName) return console.log("tried to leave a game when they weren't in one");

  try {
    if (gameRoom.gameStatus === GameStatus.IN_LOBBY || gameRoom.gameStatus === GameStatus.COUNTING_DOWN) {
      console.log("client leaving game setup screen");
      handleLeavingGameSetupScreen(io, socket, serverState, gameName_lc, isDisconnecting);
    } else {
      console.log("client leaving game in progress");
      endGameCleanup(io, socket, serverState, gameName_lc, isDisconnecting);
    }
    console.log("game list update sent after client left game");
    io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, sanitizeGameRoomsForClient(gameRooms));
  } catch (error) {
    console.log(error);
  }
}
