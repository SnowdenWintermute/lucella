import mongoose from "mongoose";

const BattleRoomLadderSchema = new mongoose.Schema({
  ladder: [{ type: mongoose.Schema.Types.ObjectId, ref: "battleRoomRecord" }],
});

export default mongoose.model("battleRoomLadder", BattleRoomLadderSchema);
