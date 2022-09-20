const bcrypt = require("bcryptjs");
const User = require("../../../models/User");
const BattleRoomRecord = require("../../../models/BattleRoomRecord");
const BattleRoomLadder = require("../../../models/BattleRoomLadder");

async function createUsersAndBattleRoomData(req, res) {
  const { numUsersToCreate } = req.body;
  try {
    for (let i = 0; i < numUsersToCreate; i++) {
      const name = `test${i}`;
      const password = "111111";
      const userExists = await User.findOne({ name });
      const newUser = new User({
        email: `test${i}@gmail.com`,
        name,
        password,
      });
      if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
      }

      const battleRoomRecordIdToCheck = userExists
        ? userExists.id
        : await User.findOne({ name }).id;
      const battleRoomRecordExists = await BattleRoomRecord.findOne({
        user: battleRoomRecordIdToCheck,
      });

      const newBattleRoomRecord = new BattleRoomRecord();
      if (!battleRoomRecordExists) {
        newBattleRoomRecord.user = battleRoomRecordIdToCheck;
        newBattleRoomRecord.wins = Math.floor(Math.random() * 100);
        newBattleRoomRecord.losses = Math.floor(Math.random() * 100);
        newBattleRoomRecord.disconnects = 0;
        newBattleRoomRecord.winrate =
          (newBattleRoomRecord.wins /
            (newBattleRoomRecord.losses + newBattleRoomRecord.wins)) *
          100;
        newBattleRoomRecord.elo = Math.floor(
          Math.random() * (2400 - 800 + 1) + 800,
        );

        await newBattleRoomRecord.save();
      }

      let ladder = await BattleRoomLadder.findOne({}).populate("ladder");
      if (!ladder) {
        ladder = new BattleRoomLadder();
      }
      ladder.ladder.push(newBattleRoomRecord.id);
      ladder.ladder.sort((a, b) => b.elo - a.elo);

      await ladder.save();
    }
    res.send("successfully created " + numUsersToCreate + " users");
  } catch (err) {
    res.send("server error");
    console.log(err);
  }
}

module.exports = createUsersAndBattleRoomData;
