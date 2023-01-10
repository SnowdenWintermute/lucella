import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { validate } from "../middleware/validate";
import loginHandler from "../controllers/auth-controllers/loginHandler";
import logoutHandler from "../controllers/auth-controllers/logoutHandler";
import passwordResetEmailRequestHandler from "../controllers/auth-controllers/passwordResetEmailRequestHandler";

import { AuthRoutePaths } from "../../../common";
import { loginSchema } from "../user-input-validation-schema/login-schema";
import { passwordResetEmailRequestIpRateLimiter } from "../middleware/rateLimiter";

const router = express.Router();
router.post(AuthRoutePaths.LOGOUT, deserializeUser, logoutHandler);
router.post("/", validate(loginSchema), loginHandler);
router.post(AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL, passwordResetEmailRequestIpRateLimiter, passwordResetEmailRequestHandler);

export default router;
