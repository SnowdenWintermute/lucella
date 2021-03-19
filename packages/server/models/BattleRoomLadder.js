const mongoose = require("mongoose");
const BattleRoomRecordSchema = require("./BattleRoomRecord").schema;

const BattleRoomLadderSchema = new mongoose.Schema({
  ladder: [{ type: mongoose.Schema.Types.ObjectId, ref: "battleRoomRecord" }],
});

module.exports = BattleRoomLadder = mongoose.model(
  "battleRoomLadder",
  BattleRoomLadderSchema,
);
