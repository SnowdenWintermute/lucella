import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { ModerationRoutePaths, UserRole } from "../../../common";
import { restrictTo } from "../middleware/restrictTo";
import banIpAddressHandler from "../controllers/security-controllers/banIpHandler";

const router = express.Router();
router.use(deserializeUser, restrictTo(UserRole.MODERATOR, UserRole.ADMIN));
router.post(ModerationRoutePaths.IP_BAN, banIpAddressHandler);

export default router;
