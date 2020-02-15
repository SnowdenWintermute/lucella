const express = require("express");
const router = express.Router();
const passwordResetAuth = require("../../middleware/passwordResetAuth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const config = require("config");
const User = require("../../models/User");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with six or more characters"
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/users/reset-password
// @desc    Change a user's password
// @access  Private
router.post(
  "/reset-password/:passwordResetToken",
  [
    check(
      "password",
      "Please enter a password with six or more characters"
    ).isLength({
      min: 6
    }),
    passwordResetAuth
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.password !== req.body.password2) {
      errors = [
        {
          location: "body",
          msg: "Passwords do not match",
          param: "password"
        }
      ];
      return res.status(400).json({ errors: errors });
    }

    try {
      const user = await User.findById(req.user.id);
      const salt = await bcrypt.genSalt(10);
      const newPassword = req.body.password;
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      console.log("password updated");

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ msg: "Password updated successfully", token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
