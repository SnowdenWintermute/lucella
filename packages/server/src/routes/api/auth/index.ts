import express from "express";
import auth from "../middleware/auth";
import { check } from "express-validator";
const authMainRouter = express.Router();

// @access  Private
authMainRouter.get("/", auth, require("./getUser"));
authMainRouter.post(
  "/",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  require("./loginUser")
);

// @access  Public
authMainRouter.post(
  "/request-password-reset",
  check("email", "Please enter an email address").isEmail(),
  require("./requestPasswordReset")
);

export default authMainRouter;
