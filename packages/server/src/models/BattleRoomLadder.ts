import { Schema, model } from "mongoose";
import { IBattleRoomRecord } from "./BattleRoomRecord";

export interface IBattleRoomLadder {
  ladder: [IBattleRoomRecord];
  id: string;
}

const BattleRoomLadderSchema = new Schema<IBattleRoomLadder>({
  ladder: [{ type: Schema.Types.ObjectId, ref: "battleRoomRecord" }],
});

const BattleRoomLadder = model<IBattleRoomLadder>("battleRoomLadder", BattleRoomLadderSchema);
export default BattleRoomLadder;
