import startGameCountdown from "../startGameCountdown";
import cancelGameCountdown from "../cancelGameCountdown";
import togglePlayerReadyState from "./togglePlayerReadyState";
import ServerState from "../../../interfaces/ServerState";
import { Server, Socket } from "socket.io";
import { GameStatus, SocketEventsFromServer } from "../../../../../common";

// old - delete

export default function (io: Server, socket: Socket | undefined, serverState: ServerState) {
  try {
    if (!socket) return new Error("client tried to ready up but their socket wasn't found");
    const { connectedSockets, gameRooms } = serverState;
    const { currentGameName } = serverState.connectedSockets[socket.id];
    if (!currentGameName) throw new Error("client clicked ready but wasn't in a game");
    const gameRoom = gameRooms[currentGameName];
    const { players, playersReady } = gameRoom;
    if (!gameRoom) throw new Error("No such game exists");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked) throw new Error("Can't unready from ranked game");
    togglePlayerReadyState(socket, serverState, players, playersReady);
    io.to(`game-${currentGameName}`).emit(SocketEventsFromServer.PLAYER_READINESS_UPDATE, playersReady);
    if (playersReady.host && playersReady.challenger) startGameCountdown(io, socket, serverState, currentGameName);
    else cancelGameCountdown(io, gameRoom);
  } catch (error) {
    console.log(error);
  }
}
