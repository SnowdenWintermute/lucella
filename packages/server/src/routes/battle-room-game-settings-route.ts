import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import createOrUpdateBattleRoomGameSettings from "../controllers/battle-room-game-settings-controllers/createOrUpdateBattleRoomGameSettings";
import getBattleRoomGameSettings from "../controllers/battle-room-game-settings-controllers/getBattleRoomGameSettings";

const router = express.Router();
router.use(deserializeUser);
router.get("", getBattleRoomGameSettings);
router.post("", createOrUpdateBattleRoomGameSettings);
router.put("", createOrUpdateBattleRoomGameSettings);

export default router;
