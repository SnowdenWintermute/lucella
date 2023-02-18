import express from "express";
import { LadderRoutePaths } from "../../../common";
import getBattleRoomLadderPage from "../controllers/battle-room-ladder-controllers/getBattleRoomLadderPage";

const battleRoomLadderRouter = express.Router();

battleRoomLadderRouter.get("/:page", getBattleRoomLadderPage);
battleRoomLadderRouter.get(`${LadderRoutePaths.ENTRIES}/:username`, getBattleRoomLadderPage);

export default battleRoomLadderRouter;
