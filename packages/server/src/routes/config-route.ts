import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { ConfigRoutePaths, UserRole } from "../../../common";
import { restrictTo } from "../middleware/restrictTo";
import setMaxConcurrentGames from "../controllers/config-controllers/setMaxConcurrentGames";
import setGameStartCountdown from "../controllers/config-controllers/setGameStartCountdown";

const router = express.Router();
router.use(deserializeUser, restrictTo(UserRole.ADMIN));
router.put(ConfigRoutePaths.MAX_CONCURRENT_GAMES, setMaxConcurrentGames);
router.put(ConfigRoutePaths.GAME_START_COUNTDOWN, setGameStartCountdown);

export default router;
