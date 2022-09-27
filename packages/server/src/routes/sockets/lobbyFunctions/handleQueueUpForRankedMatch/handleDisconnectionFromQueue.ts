import { Server } from "socket.io";
import { RankedQueue, RankedQueueUser } from "../../../../interfaces/ServerState";

export default function (
  io: Server,
  rankedQueue: RankedQueue,
  players: { host: RankedQueueUser; challenger: RankedQueueUser }
) {
  if (!io.sockets.sockets.get(players.host.socketId)) delete rankedQueue.users[players.host.socketId];
  if (!io.sockets.sockets.get(players.challenger.socketId)) delete rankedQueue.users[players.challenger.socketId];
}
