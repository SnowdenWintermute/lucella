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
    const pageSize = 10;
    console.log("sending ladder page " + page);
    const startIndex = (page - 1) * pageSize;
    const endIndex =
      startIndex + pageSize > ladder.ladder.length
        ? startIndex + (ladder.ladder.length - pageSize)
        : startIndex + pageSize;

    const ladderPageToSend = ladder.ladder.slice(startIndex, endIndex);
    const totalNumberOfPages = Math.ceil(ladder.ladder.length / pageSize);

    console.log("startIndex " + startIndex);
    console.log("endIndex " + endIndex);
    console.log("ladderlength " + ladder.ladder.length);
    console.log("pageSize " + pageSize);
    console.log(totalNumberOfPages);

    res.json({ pageData: ladderPageToSend, totalNumberOfPages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
