// import { IBattleRoomRecord } from "../../../../models/BattleRoomRecord";

// import BattleRoomLadder, { IBattleRoomLadder } from "../../../../models/BattleRoomLadder";
// import { HydratedDocument } from "mongoose";

// export default async function (hostBattleRoomRecord: IBattleRoomRecord, challengerBattleRoomRecord: IBattleRoomRecord) {
//   let ladder: HydratedDocument<IBattleRoomLadder> =
//     (await BattleRoomLadder.findOne({}).populate("ladder")) || new BattleRoomLadder<IBattleRoomLadder>();
//   let oldHostRank: number, oldChallengerRank: number, newHostRank: number, newChallengerRank: number;
//   oldHostRank = ladder.ladder.findIndex((i) => i.id === hostBattleRoomRecord.id);
//   oldChallengerRank = ladder.ladder.findIndex((i) => i.id === challengerBattleRoomRecord.id);
//   if (oldHostRank === -1) ladder.ladder.push(hostBattleRoomRecord.id);
//   if (oldChallengerRank === -1) ladder.ladder.push(challengerBattleRoomRecord.id);
//   ladder.ladder.sort((a, b) => b.elo - a.elo);
//   newHostRank = ladder.ladder.findIndex((i) => i.id === hostBattleRoomRecord.id);
//   newChallengerRank = ladder.ladder.findIndex((i) => i.id === challengerBattleRoomRecord.id);

//   await ladder.save();
//   return { oldHostRank, oldChallengerRank, newHostRank, newChallengerRank };
// }
