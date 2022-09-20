import mongoose from "mongoose";

const BattleRoomGameRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  winner: {
    name: {
      type: String,
    },
    oldElo: {
      type: Number,
    },
    newElo: {
      type: Number,
    },
  },
  loser: {
    name: {
      type: String,
    },
    oldElo: {
      type: Number,
    },
    newElo: {
      type: Number,
    },
  },
  winnerScore: {
    type: Number,
  },
  loserScore: {
    type: Number,
  },
});

export default mongoose.model("battleRoomGameRecord", BattleRoomGameRecordSchema);
