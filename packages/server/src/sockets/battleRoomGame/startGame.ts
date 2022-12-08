import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import { BattleRoomGame, SocketEventsFromServer } from "../../../../common";
import createGamePhysicsInterval from "./createGamePhysicsInterval";

// old - delete

export default function startGame(io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const { gameRooms, games } = serverState;
  const gameRoom = gameRooms[gameName];
  if (!gameRoom) return;
  games[gameName] = new BattleRoomGame(gameName);
  const game = games[gameName];
  io.to(`game-${gameName}`).emit(SocketEventsFromServer.GAME_INITIALIZATION);
  game.intervals.physics = createGamePhysicsInterval(io, socket, serverState, gameName);
}
