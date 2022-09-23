import User, { IUser } from "../../../models/User";
import BattleRoomRecord from "../../../models/BattleRoomRecord";
import BattleRoomLadder from "../../../models/BattleRoomLadder";

export default async function (req, res) {
  const { username } = req.params;
  try {
    let dataToSend;
    const user = await User.findOne<IUser>({ name: username });
    const userBattleRoomRecord = await BattleRoomRecord.findOne({
      user: user,
    }).populate({
      path: "user",
      select: "name",
    });
    const ladder = await BattleRoomLadder.findOne({});
    if (!ladder) return res.status(404).send("no ladder exists");
    if (!userBattleRoomRecord) return res.status(404).send("no ladder record for this user exists");
    if (!user) res.status(404).send("User not found. Please note that names are case sensitive.");
    const calculatedRank =
      ladder.ladder.findIndex((i) => {
        return i == userBattleRoomRecord.id;
      }) + 1;
    dataToSend = { ...userBattleRoomRecord.toObject() };
    dataToSend.rank = calculatedRank;
    res.status(200).json(dataToSend);
  } catch (err) {
    console.error(err.message);
    res.status(404).send("User not found. Please note that names are case sensitive.");
  }
}
