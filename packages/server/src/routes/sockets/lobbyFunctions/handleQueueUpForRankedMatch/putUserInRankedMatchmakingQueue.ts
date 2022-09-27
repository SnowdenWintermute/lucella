import { Socket } from "socket.io";
import { RankedQueue } from "../../../../interfaces/ServerState";
import { IBattleRoomRecord } from "../../../../models/BattleRoomRecord";
import { IUser } from "../../../../models/User";

export default function (
  socket: Socket,
  rankedQueue: RankedQueue,
  user: IUser,
  userBattleRoomRecord: IBattleRoomRecord
) {
  rankedQueue.users[socket.id] = {
    userId: user.id,
    record: userBattleRoomRecord,
    socketId: socket.id,
  };
  socket.join("ranked-queue");
  socket.emit("matchmakningQueueJoined");
}
