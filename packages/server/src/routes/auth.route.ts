import express from "express";
import { requireUser } from "../middleware/requireUser";
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

const router = express.Router();

router.post("/register", validate(createUserSchema), registerNewAccountHandler);
router.post("/login", validate(loginUserSchema), loginHandler);

router.get("/refresh", refreshAccessTokenHandler);
router.put("/password-reset", resetPasswordHandler);
router.use(deserializeUser, requireUser);
router.get("/me", getMeHandler);
router.get("/logout", logoutHandler);
router.delete("/delete-account", deleteAccountHandler);
router.post("/request-password-reset-email", passwordResetEmailRequestHandler);

export default router;
