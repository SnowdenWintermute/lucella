import startGameCountdown from "../startGameCountdown";
import cancelGameCountdown from "../cancelGameCountdown";
import togglePlayerReadyState from "./togglePlayerReadyState";
import ServerState from "../../../../interfaces/ServerState";
import { Server, Socket } from "socket.io";
import { GameStatus } from "../../../../../../common";

export default function (io: Server, socket: Socket | undefined, serverState: ServerState, gameName: string) {
  try {
    if (!socket) return new Error("client tried to ready up but their socket wasn't found");
    const { connectedSockets, gameRooms } = serverState;
    const gameRoom = gameRooms[gameName];
    const { players, playersReady } = gameRoom;
    if (!connectedSockets[socket.id].currentGameName) throw new Error("Already in game");
    if (!gameRoom) throw new Error("No such game exists");
    if (gameRoom.gameStatus === GameStatus.COUNTING_DOWN && gameRoom.isRanked)
      throw new Error("Can't unready from ranked game");
    togglePlayerReadyState(socket, serverState, players, playersReady);
    io.to(`game-${gameName}`).emit("updateOfcurrentChatChannelPlayerReadyStatus", playersReady);
    if (playersReady.host && playersReady.challenger) startGameCountdown(io, serverState, gameName);
    else cancelGameCountdown(io, gameRoom);
  } catch (error) {
    console.log(error);
  }
}
