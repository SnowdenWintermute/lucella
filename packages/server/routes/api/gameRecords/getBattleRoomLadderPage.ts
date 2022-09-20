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
    if (!ladder) return res.json("no ladder yet")
    const page = req.params.page;
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    let endIndex
    if (startIndex + pageSize > ladder.ladder.length) {
      if (page == 1) {
        endIndex = ladder.ladder.length
      } else {
        endIndex = ladder.ladder.length - pageSize * page
      }
    } else {
      endIndex = startIndex + pageSize
    }

    const ladderPageToSend = ladder.ladder.slice(startIndex, endIndex);
    const totalNumberOfPages = Math.ceil(ladder.ladder.length / pageSize);

    res.json({ pageData: ladderPageToSend, totalNumberOfPages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
