const express = require("express");
const gameRecordsMainRouter = express.Router();

// @route   GET api/gameRecords/battle-room-ladder
// @desc    Get page of battle-room ladder
// @access  Public
gameRecordsMainRouter.get(
  "/battle-room-ladder-page/:page",
  require("./getBattleRoomLadderPage"),
);

// @route   GET api/gameRecords/battle-room-record
// @desc    Get a user's battle-room record
// @access  Public
gameRecordsMainRouter.get(
  "/battle-room-ladder/:username",
  require("./getBattleRoomUserRecord"),
);

module.exports = gameRecordsMainRouter;
