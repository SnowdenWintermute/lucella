import { GameStatus } from "@lucella/common/battleRoomGame/enums";
import { Server, Socket } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";

const endGameCleanup = require("../../battleRoomGame/endGameCleanup");
const handleLeavingGameSetupScreen = require("./handleLeavingGameSetupScreen");

export default function (io: Server, socket: Socket, serverState: ServerState, gameName, isDisconnecting) {
  const { connectedSockets, gameRooms } = serverState;
  const gameRoom = gameRooms[gameName];
  if (!gameRoom) return socket.emit("errorMessage", "No game by that name exists");
  if (!isDisconnecting && !connectedSockets[socket.id].currentGameName)
    return console.log("tried to leave a game when they weren't in one");

  try {
    if (gameRoom.gameStatus === GameStatus.IN_LOBBY || gameRoom.gameStatus === GameStatus.COUNTING_DOWN)
      handleLeavingGameSetupScreen(io, socket, serverState, gameName, isDisconnecting);
    else
      endGameCleanup({
        serverState,
        gameName,
        isDisconnecting,
      });
    io.sockets.emit("gameListUpdate", gameRooms);
  } catch (error) {
    console.log(error);
  }
}