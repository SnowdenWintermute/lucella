import fetchOrCreateBattleRoomRecord from "./fetchOrCreateBattleRoomRecord";
import putUserInRankedMatchmakingQueue from "./putUserInRankedMatchmakingQueue";
import createMatchmakingInterval from "./createMatchmakingInterval";
import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";
import { SocketEventsFromServer } from "../../../../../common";
import { findUser } from "../../../services/user.service";

export default async function handleQueueUpForRankedMatch(io: Server, socket: Socket, serverState: ServerState) {
  const { connectedSockets, rankedQueue } = serverState;
  if (connectedSockets[socket.id].currentGameName)
    return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "You are already in a game");
  const user = await findUser({ name: connectedSockets[socket.id].associatedUser.username });
  if (!user)
    return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, "Log in or create an account to play ranked games");
  let userBattleRoomRecord = await fetchOrCreateBattleRoomRecord(user);
  putUserInRankedMatchmakingQueue(socket, rankedQueue, user, userBattleRoomRecord);
  rankedQueue.currentEloDiffThreshold = 0;
  if (rankedQueue.matchmakingInterval === null || !rankedQueue.matchmakingInterval)
    createMatchmakingInterval(io, serverState);
}
