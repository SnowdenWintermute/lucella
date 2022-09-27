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
  io.sockets.sockets[players.host.socketId].emit("matchFound");
  io.sockets.sockets[players.challenger.socketId].emit("matchFound");
  io.sockets.sockets[players.host.socketId].leave("ranked-queue");
  io.sockets.sockets[players.challenger.socketId].leave("ranked-queue");
}
