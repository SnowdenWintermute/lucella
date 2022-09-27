import Router from "express";
import getBattleRoomLadderPage from "./getBattleRoomLadderPage";
import getBattleRoomUserRecord from "./getBattleRoomUserRecord";
const gameRecordsMainRouter = Router();

// @route   GET api/gameRecords/battle-room-ladder
// @desc    Get page of battle-room ladder
// @access  Public
gameRecordsMainRouter.get("/battle-room-ladder-page/:page", getBattleRoomLadderPage);

// @route   GET api/gameRecords/battle-room-record
// @desc    Get a user's battle-room record
// @access  Public
gameRecordsMainRouter.get("/battle-room-ladder/:username", getBattleRoomUserRecord);

export default gameRecordsMainRouter;
