const User = require("../../../models/User");
const BattleRoomRecord = require("../../../models/BattleRoomRecord");
const BattleRoomLadder = require("../../../models/BattleRoomLadder");

module.exports = async (req, res) => {
  const { username } = req.params;
  try {
    let dataToSend;
    const user = await User.findOne({ name: username });
    const userBattleRoomRecord = await BattleRoomRecord.findOne({
      user: user,
    }).populate({
      path: "user",
      select: "name",
    });
    const ladder = await BattleRoomLadder.findOne({});
    if (user) {
      const calculatedRank =
        ladder.ladder.findIndex((i) => {
          return i == userBattleRoomRecord.id;
        }) + 1;
      dataToSend = { ...userBattleRoomRecord.toObject() };
      dataToSend.rank = calculatedRank;
    } else {
      res
        .status(404)
        .send("User not found. Please note that names are case sensitive.");
    }

    res.status(200).json(dataToSend);
  } catch (err) {
    console.error(err.message);
    res
      .status(404)
      .send("User not found. Please note that names are case sensitive.");
  }
};
