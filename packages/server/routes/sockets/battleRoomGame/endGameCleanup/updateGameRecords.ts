const User = require("../../../../models/User");
const BattleRoomRecord = require("../../../../models/BattleRoomRecord");
const BattleRoomGameRecord = require("../../../../models/BattleRoomGameRecord");
const updateWinLossRecords = require("./updateWinLossRecords");
const updateElos = require("./updateElos");
const updateLadder = require("./updateLadder");

module.exports = async ({ winner, loser, gameRoom, gameData, isRanked }) => {
  if (!isRanked)
    return {
      casualGame: true,
    };

  const winnerRole =
    gameRoom.players.host.username === winner ? "host" : "challenger";
  const loserRole =
    gameRoom.players.challenger.username === winner ? "host" : "challenger";
  const winnerScore = gameData.gameState.score[winnerRole];
  const loserScore = gameData.gameState.score[loserRole];

  // determine if both players have accounts in the database
  const hostDbRecord = await User.findOne({
    name: gameRoom.players.host.username,
  });
  const challengerDbRecord = await User.findOne({
    name: gameRoom.players.challenger.username,
  });
  // if both players are registered users, update their win loss records
  let hostBattleRoomRecord = await BattleRoomRecord.findOne({
    user: hostDbRecord.id,
  });
  let challengerBattleRoomRecord = await BattleRoomRecord.findOne({
    user: challengerDbRecord.id,
  });

  const [hostElo, challengerElo, newHostElo, newChallengerElo] = updateElos({
    hostBattleRoomRecord,
    challengerBattleRoomRecord,
    winnerRole,
  });
  hostBattleRoomRecord.elo = newHostElo;
  challengerBattleRoomRecord.elo = newChallengerElo;

  updateWinLossRecords({
    winnerRole,
    hostBattleRoomRecord,
    challengerBattleRoomRecord,
  });

  await hostBattleRoomRecord.save();
  await challengerBattleRoomRecord.save();

  const gameRecord = new BattleRoomGameRecord({
    winner: {
      name: winner,
      oldElo: winnerRole === "host" ? hostElo : challengerElo,
      newElo: winnerRole === "host" ? newHostElo : newChallengerElo,
    },
    loser: {
      name: loser,
      oldElo: winnerRole === "host" ? challengerElo : hostElo,
      newElo: winnerRole === "host" ? newChallengerElo : newHostElo,
    },
    winnerScore,
    loserScore,
  });
  await gameRecord.save();

  const [
    oldHostRank,
    oldChallengerRank,
    newHostRank,
    newChallengerRank,
  ] = await updateLadder({
    hostBattleRoomRecord,
    challengerBattleRoomRecord,
  });

  return {
    hostElo,
    challengerElo,
    newHostElo,
    newChallengerElo,
    oldHostRank,
    newHostRank,
    oldChallengerRank,
    newChallengerRank,
  };
};
