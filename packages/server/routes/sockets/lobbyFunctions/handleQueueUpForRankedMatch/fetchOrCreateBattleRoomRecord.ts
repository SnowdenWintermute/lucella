const BattleRoomRecord = require("../../../../models/BattleRoomRecord");

module.exports = async (user) => {
  let record = await BattleRoomRecord.findOne({ user: user.id });
  if (!record) record = new BattleRoomRecord({ user: user.id });
  await record.save();
  return record
}