import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import refreshSession from "../middleware/refreshSession";
import { validate } from "../middleware/validate";
import registerNewAccountHandler from "../controllers/users-controllers/registerNewAccountHandler";
import deleteAccountHandler from "../controllers/users-controllers/deleteAccountHandler";
import changePasswordHandler from "../controllers/users-controllers/changePasswordHandler";
import getMeHandler from "../controllers/users-controllers/getMeHandler";
import { registerUserSchema } from "../user-input-validation-schema/register-user-schema";
import {
  perIpEnforcementWindowTime,
  perIpFixedWindowCounterLimit,
  perIpFixedWindowCounterTime,
  perIpSlidingWindwRateLimit,
  UsersRoutePaths,
} from "../../../common";
import { changePasswordSchema } from "../user-input-validation-schema/change-password-schema";
import accountActivationHandler from "../controllers/users-controllers/accountActivationHandler";

import { requireTesterKey } from "../middleware/requireTesterKey";
import dropAllTestUsers from "../controllers/users-controllers/for-cypress-tests/dropAllTestUsers";
import createCypressTestUser from "../controllers/users-controllers/for-cypress-tests/createCypressTestUser";
import createRateLimiterMiddleware, { RateLimiterModes } from "../middleware/rateLimiter";

const ipRateLimiter = createRateLimiterMiddleware(
  RateLimiterModes.IP,
  "",
  perIpEnforcementWindowTime,
  perIpSlidingWindwRateLimit,
  perIpFixedWindowCounterTime,
  perIpFixedWindowCounterLimit
);

const router = express.Router();
router.post("", validate(registerUserSchema), registerNewAccountHandler);
router.post(UsersRoutePaths.ACCOUNT_ACTIVATION, accountActivationHandler);
router.put(UsersRoutePaths.PASSWORD, validate(changePasswordSchema), changePasswordHandler);
router.put(UsersRoutePaths.DROP_ALL_TEST_USERS, requireTesterKey, dropAllTestUsers);
router.post(UsersRoutePaths.CREATE_CYPRESS_TEST_USER, requireTesterKey, createCypressTestUser);
router.use(deserializeUser, refreshSession, ipRateLimiter);
router.get("", getMeHandler);
router.put(UsersRoutePaths.ACCOUNT_DELETION, deleteAccountHandler);

export default router;
