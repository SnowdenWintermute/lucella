const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../../models/User");

module.exports = async (req, res) => {
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
      process.env.JWT_SECRET,
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
};
