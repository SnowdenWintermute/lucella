import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { validate } from "../middleware/validate";
import registerNewAccountHandler from "../controllers/users-controllers/registerNewAccountHandler";
import deleteAccountHandler from "../controllers/users-controllers/deleteAccountHandler";
import changePasswordHandler from "../controllers/users-controllers/changePasswordHandler";
import getMeHandler from "../controllers/users-controllers/getMeHandler";
import { registerUserSchema } from "../user-input-validation-schema/register-user-schema";
import { UsersRoutePaths } from "../../../common";
import { changePasswordSchema } from "../user-input-validation-schema/change-password-schema";

const router = express.Router();
router.post("", validate(registerUserSchema), registerNewAccountHandler);
router.put(UsersRoutePaths.PASSWORD, validate(changePasswordSchema), changePasswordHandler);
router.use(deserializeUser);
router.get("", getMeHandler);
router.delete("", deleteAccountHandler);

export default router;
