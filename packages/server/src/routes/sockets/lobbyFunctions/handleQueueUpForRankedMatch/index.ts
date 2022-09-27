import fetchOrCreateBattleRoomRecord from "./fetchOrCreateBattleRoomRecord";
import putUserInRankedMatchmakingQueue from "./putUserInRankedMatchmakingQueue";
import createMatchmakingInterval from "./createMatchmakingInterval";
import User from "../../../../models/User";
import { Server, Socket } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";

export default async function clientClicksRanked(io: Server, socket: Socket, serverState: ServerState) {
  const { connectedSockets, rankedQueue } = serverState;
  if (connectedSockets[socket.id].currentGameName) return socket.emit("errorMessage", "You are already in a game");
  const user = await User.findOne({ name: connectedSockets[socket.id].associatedUser.username });
  if (!user) return socket.emit("errorMessage", "Log in or create an account to play ranked games");
  let userBattleRoomRecord = await fetchOrCreateBattleRoomRecord(user);
  putUserInRankedMatchmakingQueue(socket, rankedQueue, user, userBattleRoomRecord);
  rankedQueue.currentEloDiffThreshold = 0;
  if (rankedQueue.matchmakingInterval === null || !rankedQueue.matchmakingInterval)
    createMatchmakingInterval(io, serverState);
}
