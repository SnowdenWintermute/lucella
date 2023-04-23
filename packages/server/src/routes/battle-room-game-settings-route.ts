import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { UserRole } from "../../../common";
import { restrictTo } from "../middleware/restrictTo";
import createOrUpdateBattleRoomGameSettings from "../controllers/battle-room-game-settings-controllers/createOrUpdateBattleRoomGameSettings";

const router = express.Router();
router.use(deserializeUser, restrictTo(UserRole.USER));
router.post("", createOrUpdateBattleRoomGameSettings);
router.put("", createOrUpdateBattleRoomGameSettings);
// router.delete("");

export default router;
