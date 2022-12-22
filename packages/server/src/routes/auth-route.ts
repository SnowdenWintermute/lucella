import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { validate } from "../middleware/validate";
import { createUserSchema, loginUserSchema } from "../schema-validation/user-schema";
import registerNewAccountHandler from "../controllers/auth-controllers/registerNewAccountHandler";
import loginHandler from "../controllers/auth-controllers/loginHandler";
import refreshAccessTokenHandler from "../controllers/auth-controllers/refreshAccessTokenHandler";
import logoutHandler from "../controllers/auth-controllers/logoutHandler";
import deleteAccountHandler from "../controllers/auth-controllers/deleteAccountHandler";
import passwordResetEmailRequestHandler from "../controllers/auth-controllers/passwordResetEmailRequestHandler";
import resetPasswordHandler from "../controllers/auth-controllers/resetPasswordHandler";
import getMeHandler from "../controllers/auth-controllers/getMeHandler";
import { AuthRoutePaths } from "../../../common";

const router = express.Router();

router.post(AuthRoutePaths.REGISTER, validate(createUserSchema), registerNewAccountHandler);
router.post(AuthRoutePaths.LOGIN, validate(loginUserSchema), loginHandler);
router.get(AuthRoutePaths.REFRESH_SESSION, refreshAccessTokenHandler);
router.put(AuthRoutePaths.RESET_PASSWORD, resetPasswordHandler);
router.use(deserializeUser);
router.get(AuthRoutePaths.ME, getMeHandler);
router.get(AuthRoutePaths.LOGOUT, logoutHandler);
router.delete(AuthRoutePaths.DELETE_ACCOUNT, deleteAccountHandler);
router.post(AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL, passwordResetEmailRequestHandler);

export default router;
