// import { Socket } from "socket.io";
// import { RankedQueue } from "../../../interfaces/ServerState";
// import { IBattleRoomRecord } from "../../../models/BattleRoomRecord";
// import { User } from "../../../models/user.model";

// export default function putUserInRankedMatchmakingQueue(
//   socket: Socket,
//   rankedQueue: RankedQueue,
//   user: User,
//   userBattleRoomRecord: IBattleRoomRecord
// ) {
//   rankedQueue.users[socket.id] = {
//     userId: user.id,
//     record: userBattleRoomRecord,
//     socketId: socket.id,
//     username: user.name,
//   };
//   socket.join("ranked-queue");
//   socket.emit("matchmakningQueueJoined");
// }