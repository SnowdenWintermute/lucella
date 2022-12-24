import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { validate } from "../middleware/validate";
import { registerUserSchema } from "../user-input-validation-schema/register-user-schema";
import { loginSchema } from "../user-input-validation-schema/login-schema";
import { changePasswordSchema } from "../user-input-validation-schema/change-password--schema";
import registerNewAccountHandler from "../controllers/auth-controllers/registerNewAccountHandler";
import loginHandler from "../controllers/auth-controllers/loginHandler";
import logoutHandler from "../controllers/auth-controllers/logoutHandler";
import deleteAccountHandler from "../controllers/auth-controllers/deleteAccountHandler";
import passwordResetEmailRequestHandler from "../controllers/auth-controllers/passwordResetEmailRequestHandler";
import changePasswordHandler from "../controllers/auth-controllers/changePasswordHandler";
import getMeHandler from "../controllers/auth-controllers/getMeHandler";
import { AuthRoutePaths } from "../../../common";

const router = express.Router();

router.post(AuthRoutePaths.REGISTER, validate(registerUserSchema), registerNewAccountHandler);
router.post(AuthRoutePaths.LOGIN, validate(loginSchema), loginHandler);
router.post(AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL, passwordResetEmailRequestHandler);
router.put(AuthRoutePaths.CHANGE_PASSWORD, validate(changePasswordSchema), changePasswordHandler);
router.use(deserializeUser);
router.get(AuthRoutePaths.ME, getMeHandler);
router.get(AuthRoutePaths.LOGOUT, logoutHandler);
router.delete(AuthRoutePaths.DELETE_ACCOUNT, deleteAccountHandler);

export default router;
