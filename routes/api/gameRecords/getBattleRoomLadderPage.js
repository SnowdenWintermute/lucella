const User = require("../../../models/User");
const BattleRoomLadder = require("../../../models/BattleRoomLadder");

module.exports = async (req, res) => {
  try {
    const ladder = await BattleRoomLadder.findOne({}).populate({
      path: "ladder",
      populate: {
        path: "user",
        model: User,
        select: "name",
      },
    });
    const page = req.params.page;
    console.log("sending ladder page " + page);
    const startIndex = (page - 1) * 10;
    const endIndex =
      startIndex + 10 > ladder.ladder.length - startIndex + 10
        ? ladder.ladder.length - startIndex - 1
        : startIndex + 10;

    const ladderPageToSend = ladder.ladder.splice(startIndex, endIndex);

    res.json(ladderPageToSend);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
