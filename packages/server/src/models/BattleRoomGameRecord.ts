// import { Schema, model } from "mongoose";

// interface BRGameRecordUserEntry {
//   name: {
//     type: string;
//   };
//   oldElo: {
//     type: number;
//   };
//   newElo: {
//     type: number;
//   };
//   id: string;
// }

// export interface IBattleRoomGameRecord {
//   date: Date;
//   winner: BRGameRecordUserEntry;
//   loser: BRGameRecordUserEntry;
//   winnerScore: number;
//   loserScore: number;
// }

// const BattleRoomGameRecordSchema = new Schema<IBattleRoomGameRecord>({
//   date: {
//     type: Date,
//     default: Date.now(),
//   },
//   winner: {
//     name: {
//       type: String,
//     },
//     oldElo: {
//       type: Number,
//     },
//     newElo: {
//       type: Number,
//     },
//   },
//   loser: {
//     name: {
//       type: String,
//     },
//     oldElo: {
//       type: Number,
//     },
//     newElo: {
//       type: Number,
//     },
//   },
//   winnerScore: {
//     type: Number,
//   },
//   loserScore: {
//     type: Number,
//   },
// });

// const BattleRoomGameRecord = model<IBattleRoomGameRecord>("battleRoomGameRecord", BattleRoomGameRecordSchema);
// export default BattleRoomGameRecord;
