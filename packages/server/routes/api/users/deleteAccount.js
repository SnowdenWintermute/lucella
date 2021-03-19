const User = require("../../../models/User");
const { validationResult } = require("express-validator");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    if (user.email !== req.body.email) {
      return res.status(400).json({
        errors: [{ msg: "Email entered does not match account email address" }]
      });
    } else {
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ msg: "Account deleted" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
