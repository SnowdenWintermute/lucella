const mongoose = require("mongoose");
const BattleRoomGameRecordSchema = require("./BattleRoomGameRecord").schema;

const BattleRoomRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  casualGames: [BattleRoomGameRecordSchema],
  rankedGames: [BattleRoomGameRecordSchema],
});

module.exports = BattleRoomRecord = mongoose.model(
  "battleRoomRecord",
  BattleRoomRecordSchema,
);
