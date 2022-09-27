import { Server } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import { BattleRoomGame } from "../common/src/classes/BattleRoomGame";
import createGamePhysicsInterval from "./createGamePhysicsInterval";
import createGameUpdateInterval from "./createGameUpdateInterval";

export default function startGame(io: Server, serverState: ServerState, gameName: string) {
  const { gameRooms, games } = serverState;
  const gameRoom = gameRooms[gameName];
  if (!gameRoom) return;
  games[gameName] = new BattleRoomGame(gameName);
  const game = games[gameName];
  io.to(`game-${gameName}`).emit("serverInitsGame");
  game.intervals.physics = createGamePhysicsInterval(serverState, gameName);
  game.intervals.broadcast = createGameUpdateInterval(io, game);
}
