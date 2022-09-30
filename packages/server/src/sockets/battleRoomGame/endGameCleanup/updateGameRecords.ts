// import { BattleRoomGame } from "../../../../../common";
// import { GameRoom } from "../../../../../common";
// import User from "../../../../models/User";
// import BattleRoomRecord from "../../../../models/BattleRoomRecord";
// import BattleRoomGameRecord from "../../../../models/BattleRoomGameRecord";
// import updateWinLossRecords from "./updateWinLossRecords";
// import updateElos from "./updateElos";
// // import updateLadder from "./updateLadder";
// import { PlayerRole } from "../../../../../common";
// import { EloUpdates } from "../../../../../common";

// export default async function (
//   winner: string,
//   loser: string,
//   gameRoom: GameRoom,
//   game: BattleRoomGame,
//   isRanked: boolean
// ): Promise<EloUpdates | null> {
//   if (!isRanked) return null;

//   const winnerRole =
//     gameRoom.players.host?.associatedUser.username === winner ? PlayerRole.HOST : PlayerRole.CHALLENGER;
//   const loserRole =
//     gameRoom.players.challenger?.associatedUser.username === winner ? PlayerRole.HOST : PlayerRole.CHALLENGER;
//   const winnerScore = game.score[winnerRole];
//   const loserScore = game.score[loserRole];

//   // determine if both players have accounts in the database
//   const hostDbRecord = await User.findOne({
//     name: gameRoom.players.host?.associatedUser.username,
//   });
//   const challengerDbRecord = await User.findOne({
//     name: gameRoom.players.challenger?.associatedUser.username,
//   });
//   if (!challengerDbRecord || !hostDbRecord)
//     throw new Error("tried to update ranked game record in a game in which at least one user wasn't registered");
//   // if both players are registered users, update their win loss records
//   let hostBattleRoomRecord = await BattleRoomRecord.findOne({
//     user: hostDbRecord.id,
//   });
//   let challengerBattleRoomRecord = await BattleRoomRecord.findOne({
//     user: challengerDbRecord.id,
//   });
//   if (!hostBattleRoomRecord || !challengerBattleRoomRecord) return null;
//   const { hostElo, challengerElo, newHostElo, newChallengerElo } = updateElos(
//     hostBattleRoomRecord,
//     challengerBattleRoomRecord,
//     winnerRole
//   );
//   hostBattleRoomRecord.elo = newHostElo;
//   challengerBattleRoomRecord.elo = newChallengerElo;

//   updateWinLossRecords(winnerRole, hostBattleRoomRecord, challengerBattleRoomRecord);

//   await hostBattleRoomRecord.save();
//   await challengerBattleRoomRecord.save();

//   const gameRecord = new BattleRoomGameRecord({
//     winner: {
//       name: winner,
//       oldElo: winnerRole === "host" ? hostElo : challengerElo,
//       newElo: winnerRole === "host" ? newHostElo : newChallengerElo,
//     },
//     loser: {
//       name: loser,
//       oldElo: winnerRole === "host" ? challengerElo : hostElo,
//       newElo: winnerRole === "host" ? newChallengerElo : newHostElo,
//     },
//     winnerScore,
//     loserScore,
//   });
//   await gameRecord.save();

//   // const { oldHostRank, oldChallengerRank, newHostRank, newChallengerRank } = await updateLadder(
//   //   hostBattleRoomRecord,
//   //   challengerBattleRoomRecord
//   // );

//   // return {
//   //   hostElo,
//   //   challengerElo,
//   //   newHostElo,
//   //   newChallengerElo,
//   //   oldHostRank,
//   //   newHostRank,
//   //   oldChallengerRank,
//   //   newChallengerRank,
//   // };
// }
