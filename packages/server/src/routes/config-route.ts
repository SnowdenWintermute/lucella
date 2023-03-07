import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { ConfigRoutePaths, UserRole } from "../../../common";
import { restrictTo } from "../middleware/restrictTo";
import setMaxConcurrentGames from "../controllers/config-controllers/setMaxConcurrentGames";

const router = express.Router();
router.use(deserializeUser, restrictTo(UserRole.ADMIN));
router.post(ConfigRoutePaths.MAX_CONCURRENT_GAMES, setMaxConcurrentGames);

export default router;
