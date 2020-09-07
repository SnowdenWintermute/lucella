const User = require("../../../models/User");
const BattleRoomRecord = require("../../../models/BattleRoomRecord");

module.exports = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ name: username });
    const userBattleRoomRecord = await BattleRoomRecord.findOne({
      user: user,
    })
      .lean()
      .populate("user", "name");
    res.json(userBattleRoomRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
