const express = require("express");
const usersMainRouter = express.Router();
const passwordResetAuth = require("../../../middleware/passwordResetAuth");
const auth = require("../../../middleware/auth");
const { check } = require("express-validator");

// @route   POST api/users
// @desc    Register user
// @access  Public
usersMainRouter.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("name", "Please enter a name of at least three characters").isLength({
      min: 3,
    }),
    check("name", "Please enter a name of no more than 16 characters").isLength(
      {
        max: 16,
      },
    ),
    check(
      "password",
      "Please enter a password with six or more characters",
    ).isLength({
      min: 6,
    }),
  ],
  require("./registerUser"),
);

// @route   POST api/users/reset-password
// @desc    Change a user's password
// @access  Private
usersMainRouter.post(
  "/reset-password/:passwordResetToken",
  [
    check(
      "password",
      "Please enter a password with six or more characters",
    ).isLength({
      min: 6,
    }),
    passwordResetAuth,
  ],
  require("./passwordReset"),
);

// @route   POST api/users/delete-account
// @desc    Delete user account
// @access  Private
usersMainRouter.post(
  "/delete-account",
  [
    check(
      "email",
      "Please enter the email associated with this account",
    ).isEmail(),
    auth,
  ],
  require("./deleteAccount"),
);

// @route   POST api/users/create-dummy-users
// @desc    Create many user datas
// @access  Public
usersMainRouter.post(
  "/create-dummy-users",
  require("./createUsersAndBattleRoomData"),
);

module.exports = usersMainRouter;
