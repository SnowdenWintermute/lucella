const express = require("express");
const authMainRouter = express.Router();
const auth = require("../../../middleware/auth");
const { check } = require("express-validator");

// @route   GET api/auth
// @desc    Get auth user
// @access  Private
authMainRouter.get("/", auth, require("./getUser"));

// @route   POST api/auth
// @desc    Login user
// @access  Private
authMainRouter.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  require("./loginUser"),
);

// @route   POST api/auth/request-password-reset
// @desc    Send email to reset password
// @access  Public
authMainRouter.post(
  "/request-password-reset",
  check("email", "Please enter an email address").isEmail(),
  require("./requestPasswordReset"),
);

module.exports = authMainRouter;
