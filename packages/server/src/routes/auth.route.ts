import express from "express";
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
  deleteAccountHandler,
} from "../controllers/auth.controller";
import { requireUser } from "../middleware/requireUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { validate } from "../middleware/validate";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("/register", validate(createUserSchema), registerHandler);
router.post("/login", validate(loginUserSchema), loginHandler);
router.get("/refresh", refreshAccessTokenHandler);
router.use(deserializeUser, requireUser);
router.get("/logout", logoutHandler);
router.get("/delete-account", deleteAccountHandler);

export default router;
