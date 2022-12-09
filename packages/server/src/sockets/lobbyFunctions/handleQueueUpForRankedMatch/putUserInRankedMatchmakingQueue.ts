import { SocketEventsFromServer } from "../../../../../common";
import { Socket } from "socket.io";
import { RankedQueue } from "../../../interfaces/ServerState";
import { IBattleRoomRecord } from "../../../models/BattleRoomRecord";
import { User } from "../../../models/user.model";
import { MatchmakingQueue } from "../../../classes/MatchmakingQueue";

// old - delete

export default function putUserInRankedMatchmakingQueue(
  socket: Socket,
  matchmakingQueue: MatchmakingQueue,
  user: User,
  userBattleRoomRecord: IBattleRoomRecord
) {
  matchmakingQueue.users[socket.id] = {
    userId: user._id,
    record: userBattleRoomRecord,
    socketId: socket.id,
    username: user.name,
  };
  socket.join("ranked-queue");
  socket.emit(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED);
}
