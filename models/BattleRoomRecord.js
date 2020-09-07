const mongoose = require("mongoose");

const BattleRoomRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  disconnects: { type: Number, default: 0 },
  winrate: { type: Number, default: 0 },
  elo: {
    type: Number,
    default: 1500,
  },
});

module.exports = BattleRoomRecord = mongoose.model(
  "battleRoomRecord",
  BattleRoomRecordSchema,
);
