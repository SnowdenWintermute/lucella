import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { validate } from "../middleware/validate";
import { loginSchema } from "../user-input-validation-schema/login-schema";
import loginHandler from "../controllers/auth-controllers/loginHandler";
import logoutHandler from "../controllers/auth-controllers/logoutHandler";
import passwordResetEmailRequestHandler from "../controllers/auth-controllers/passwordResetEmailRequestHandler";
import { AuthRoutePaths } from "../../../common";

const router = express.Router();
router.post("/", validate(loginSchema), loginHandler);
router.post(AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL, passwordResetEmailRequestHandler);
router.use(deserializeUser);
router.post(AuthRoutePaths.LOGOUT, logoutHandler);

export default router;
