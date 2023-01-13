import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import refreshSession from "../middleware/refreshSession";
import { validate } from "../middleware/validate";
import registerNewAccountHandler from "../controllers/users-controllers/registerNewAccountHandler";
import deleteAccountHandler from "../controllers/users-controllers/deleteAccountHandler";
import changePasswordHandler from "../controllers/users-controllers/changePasswordHandler";
import getMeHandler from "../controllers/users-controllers/getMeHandler";
import { registerUserSchema } from "../user-input-validation-schema/register-user-schema";
import { UsersRoutePaths, UserRole } from "../../../common";
import { changePasswordSchema } from "../user-input-validation-schema/change-password-schema";
import accountActivationHandler from "../controllers/users-controllers/accountActivationHandler";
import { registrationIpRateLimiter } from "../middleware/rateLimiter";
import { restrictTo } from "../middleware/restrictTo";
import banUserAccountHandler from "../controllers/users-controllers/banUserAccountHandler";

const router = express.Router();
router.post("", registrationIpRateLimiter, validate(registerUserSchema), registerNewAccountHandler);
router.post(UsersRoutePaths.ACCOUNT_ACTIVATION, accountActivationHandler);
router.put(UsersRoutePaths.PASSWORD, validate(changePasswordSchema), changePasswordHandler);
router.use(deserializeUser, refreshSession);
router.get("", getMeHandler);
router.put(UsersRoutePaths.ACCOUNT_DELETION, deleteAccountHandler);
router.use(restrictTo(UserRole.MODERATOR, UserRole.ADMIN));
router.put(UsersRoutePaths.ACCOUNT_BAN, banUserAccountHandler);

export default router;
