import { Server } from "socket.io";
import { RankedQueue, RankedQueueUser } from "../../../../interfaces/ServerState";

export default function (
  io: Server,
  rankedQueue: RankedQueue,
  players: { host: RankedQueueUser; challenger: RankedQueueUser }
) {
  if (!io.sockets.sockets[players.host.socketId]) delete rankedQueue.users[io.sockets.sockets[players.host.socketId]];
  if (!io.sockets.sockets[players.challenger.socketId])
    delete rankedQueue.users[io.sockets.sockets[players.challenger.socketId]];
}
