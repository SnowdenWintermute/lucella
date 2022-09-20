const express = require("express");
const authMainRouter = express.Router();
const auth = require("../../../middleware/auth");
const { check } = require("express-validator");

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

module.exports = authMainRouter;
