const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../../models/User");

module.exports = async (req, res) => {
  console.log("getUserForSocket");
  console.log(req.headers.data);
  const token = req.headers.data;
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied.",
    });
  }
  // verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: "Token is not valid.",
    });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
