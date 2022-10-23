import BattleRoomRecord from "../../../models/BattleRoomRecord";
import { User } from "../../../models/user.model";

export default async function fetchOrCreateBattleRoomRecord(user: User) {
  let record = await BattleRoomRecord.findOne({ userId: user.id });
  if (!record) record = new BattleRoomRecord({ userId: user.id });
  await record.save();
  return record;
}
