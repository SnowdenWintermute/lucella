import auth from "../../middleware/auth";
import { check } from "express-validator";
import Router from "express";
import loginUser from "./loginUser";
import requestPasswordReset from "./requestPasswordReset";
import getUser from "./getUser";

const authMainRouter = Router();

// @access  Private
authMainRouter.get("/", auth, getUser);
authMainRouter.post(
  "/",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  loginUser
);

// @access  Public
authMainRouter.post(
  "/request-password-reset",
  check("email", "Please enter an email address").isEmail(),
  requestPasswordReset
);

export default authMainRouter;
