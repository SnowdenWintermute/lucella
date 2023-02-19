import express from "express";
import { LadderRoutePaths } from "../../../common";
import getBattleRoomLadderEntryByUsername from "../controllers/battle-room-ladder-controllers/getBattleRoomLadderEntryByUsername";
import getBattleRoomLadderPage from "../controllers/battle-room-ladder-controllers/getBattleRoomLadderPage";

const battleRoomLadderRouter = express.Router();

battleRoomLadderRouter.get("/:page", getBattleRoomLadderPage);
battleRoomLadderRouter.get(`${LadderRoutePaths.ENTRIES}/:username`, getBattleRoomLadderEntryByUsername);

export default battleRoomLadderRouter;
