// import BattleRoomRecord from "../../../../models/BattleRoomRecord";
// import { User } from "../../../../models/User";

// export default async function fetchOrCreateBattleRoomRecord(user: User) {
//   let record = await BattleRoomRecord.findOne({ user: user.id });
//   if (!record) record = new BattleRoomRecord({ user: user.id });
//   await record.save();
//   return record;
// }
