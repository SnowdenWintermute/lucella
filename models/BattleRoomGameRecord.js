mongoose = require("mongoose");

const BattleRoomGameRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  winner: {
    type: String,
  },
  loser: {
    type: String,
  },
  winnerScore: {
    type: Number,
  },
  loserScore: {
    type: Number,
  },
});

module.exports = BattleRoomGameRecord = mongoose.model(
  "battleRoomGameRecord",
  BattleRoomGameRecordSchema,
);
