import { Server } from "socket.io";
import { RankedQueue, RankedQueueUser } from "../../../../interfaces/ServerState";

// remove matched players from queue because they're in a game now
export default function (
  io: Server,
  rankedQueue: RankedQueue,
  players: { host: RankedQueueUser; challenger: RankedQueueUser }
) {
  delete rankedQueue.users[players.host.socketId];
  delete rankedQueue.users[players.challenger.socketId];
  if (!io.sockets.sockets.get(players.host.socketId))
    return new Error("tried to remove host from matchmaking queue but their socket wasn't found");
  if (!io.sockets.sockets.get(players.challenger.socketId))
    return new Error("tried to remove challenger from matchmaking queue but their socket wasn't found");
  io.sockets.sockets.get(players.host.socketId)!.emit("matchFound");
  io.sockets.sockets.get(players.challenger.socketId)!.emit("matchFound");
  io.sockets.sockets.get(players.host.socketId)!.leave("ranked-queue");
  io.sockets.sockets.get(players.challenger.socketId)!.leave("ranked-queue");
}
