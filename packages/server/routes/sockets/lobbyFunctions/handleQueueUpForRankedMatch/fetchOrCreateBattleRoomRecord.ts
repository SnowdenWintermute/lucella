import BattleRoomRecord from "../../../../models/BattleRoomRecord";
import { IUser } from "../../../../models/User";

export default async function (user) {
  let record = await BattleRoomRecord.findOne({ user: user.id });
  if (!record) record = new BattleRoomRecord({ user: user.id });
  await record.save();
  return record;
}
