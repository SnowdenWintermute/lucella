import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import createOrUpdateBattleRoomGameSettings from "../controllers/battle-room-game-settings-controllers/createOrUpdateBattleRoomGameSettings";
import getBattleRoomGameSettings from "../controllers/battle-room-game-settings-controllers/getBattleRoomGameSettings";
import resetBattleRoomGameSettingsToDefaults from "../controllers/battle-room-game-settings-controllers/resetBattleRoomGameSettingsToDefaults";
import { BattleRoomConfigRoutePaths } from "../../../common";

const router = express.Router();
router.use(deserializeUser);
router.get("", getBattleRoomGameSettings);
router.put("", createOrUpdateBattleRoomGameSettings);
router.put(BattleRoomConfigRoutePaths.RESET, resetBattleRoomGameSettingsToDefaults);

export default router;
