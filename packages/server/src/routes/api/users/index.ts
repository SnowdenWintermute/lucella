import express from "express";
import passwordResetAuth from "../../middleware/passwordResetAuth";
import auth from "../../middleware/auth";
import { check } from "express-validator";
import Router from "express";
import registerUser from "./registerUser";
import passwordReset from "./passwordReset";
import deleteAccount from "./deleteAccount";

const usersMainRouter = Router();

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
    check("name", "Please enter a name of no more than 16 characters").isLength({
      max: 16,
    }),
    check("password", "Please enter a password with six or more characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

// @route   POST api/users/reset-password
// @desc    Change a user's password
// @access  Private
usersMainRouter.post(
  "/reset-password/:passwordResetToken",
  [
    check("password", "Please enter a password with six or more characters").isLength({
      min: 6,
    }),
    passwordResetAuth,
  ],
  passwordReset
);

// @route   POST api/users/delete-account
// @desc    Delete user account
// @access  Private
usersMainRouter.post(
  "/delete-account",
  [check("email", "Please enter the email associated with this account").isEmail(), auth],
  deleteAccount
);

// @route   POST api/users/create-dummy-users
// @desc    Create many user datas
// @access  Public
// usersMainRouter.post("/create-dummy-users", require("./createUsersAndBattleRoomData"));

export default usersMainRouter;
