import { Types, Schema, model } from "mongoose";
import { startingLadderRating } from "@lucella/common/battleRoomGame/consts";

export interface IBattleRoomRecord {
  user: Types.ObjectId;
  wins: number;
  losses: number;
  disconnects: number;
  winrate: number;
  elo: number;
}

const BattleRoomRecordSchema = new Schema<IBattleRoomRecord>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  disconnects: { type: Number, default: 0 },
  winrate: { type: Number, default: 0 },
  elo: {
    type: Number,
    default: startingLadderRating,
  },
});

const BattleRoomRecord = model<IBattleRoomRecord>("battleRoomRecord", BattleRoomRecordSchema);

export default BattleRoomRecord;
