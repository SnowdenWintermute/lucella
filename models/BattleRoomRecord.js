const mongoose = require("mongoose");
const BattleRoomGameRecordSchema = require("./BattleRoomGameRecord").schema;

const BattleRoomRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  casualGames: [BattleRoomGameRecordSchema],
  rankedGames: [BattleRoomGameRecordSchema],
  wins:{type:Number,
  default:0,
  },
  losses:{type:Number,
  default:0,
  },
  disconnects:{type:Number,
  default:0,
  },
  winrate:{type:Number,
  default:0,
  }
});

module.exports = BattleRoomRecord = mongoose.model(
  "battleRoomRecord",
  BattleRoomRecordSchema,
);
