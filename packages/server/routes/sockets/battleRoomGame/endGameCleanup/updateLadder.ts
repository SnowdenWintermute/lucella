const BattleRoomLadder = require("../../../../models/BattleRoomLadder");

module.exports = async ({
  hostBattleRoomRecord,
  challengerBattleRoomRecord,
}) => {
  let ladder = await BattleRoomLadder.findOne({}).populate("ladder");
  let oldHostRank, oldChallengerRank, newHostRank, newChallengerRank;
  if (!ladder) ladder = new BattleRoomLadder();
  oldHostRank = ladder.ladder.findIndex(
    (i) => i.id === hostBattleRoomRecord.id
  );
  oldChallengerRank = ladder.ladder.findIndex(
    (i) => i.id === challengerBattleRoomRecord.id
  );
  if (oldHostRank === -1) ladder.ladder.push(hostBattleRoomRecord.id);
  if (oldChallengerRank === -1)
    ladder.ladder.push(challengerBattleRoomRecord.id);
  ladder.ladder.sort((a, b) => b.elo - a.elo);
  newHostRank = ladder.ladder.findIndex(
    (i) => i.id === hostBattleRoomRecord.id
  );
  newChallengerRank = ladder.ladder.findIndex(
    (i) => i.id === challengerBattleRoomRecord.id
  );

  await ladder.save();
  return [oldHostRank, oldChallengerRank, newHostRank, newChallengerRank];
};
