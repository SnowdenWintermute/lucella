mongoose = require("mongoose");

const BattleRoomGameRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  winner: {
    name: {
      type: String,
    },
    elo: {
      type: Number,
    },
  },
  loser: {
    name: {
      type: String,
    },
    elo: {
      type: Number,
    },
  },
  winnerScore: {
    type: Number,
  },
  loserScore: {
    type: Number,
  },
  eloChange: {
    type: Number,
  },
});

module.exports = BattleRoomGameRecord = mongoose.model(
  "battleRoomGameRecord",
  BattleRoomGameRecordSchema,
);
