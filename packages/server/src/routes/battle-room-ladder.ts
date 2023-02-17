import express from "express";
import getBattleRoomLadderPage from "../controllers/battle-room-ladder-controllers/getBattleRoomLadderPage";

const battleRoomLadderRouter = express.Router();

battleRoomLadderRouter.get("/:page", getBattleRoomLadderPage);

export default battleRoomLadderRouter;
