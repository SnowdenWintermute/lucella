const User = require("../../../models/User");
const BattleRoomRecord = require("../../../models/BattleRoomRecord");
const BattleRoomGameRecord = require("../../../models/BattleRoomGameRecord");

async function updateWinLossRecords({
  winner,
  loser,
  gameRoom,
  gameData,
  isRanked,
}) {
  // determine score
  const winnerRole =
    gameRoom.players.host.username === winner ? "host" : "challenger";
  const loserRole =
    gameRoom.players.challenger.username === winner ? "host" : "challenger";
  const winnerScore = gameData.score[winnerRole];
  const loserScore = gameData.score[loserRole];
  // create the game record
  const gameRecord = new BattleRoomGameRecord({
    winner,
    loser,
    winnerScore,
    loserScore,
  });
  const gameCategory = isRanked ? "rankedGames" : "casualGames";

  // handle host record
  const hostDbRecord = await User.findOne({
    name: gameRoom.players.host.username,
  });
  if (hostDbRecord) {
    let hostBattleRoomRecord = await BattleRoomRecord.findOne({
      user: hostDbRecord.id,
    });
    if (!hostBattleRoomRecord) {
      hostBattleRoomRecord = new BattleRoomRecord({
        user: hostDbRecord.id,
      });
    }
    hostBattleRoomRecord[gameCategory].push(gameRecord);
    await hostBattleRoomRecord.save();
  }
  // handle challenger record
  const challengerDbRecord = await User.findOne({
    name: gameRoom.players.challenger.username,
  });
  if (challengerDbRecord) {
    let challengerBattleRoomRecord = await BattleRoomRecord.findOne({
      user: challengerDbRecord.id,
    });
    if (!challengerBattleRoomRecord) {
      challengerBattleRoomRecord = new BattleRoomRecord({
        user: challengerDbRecord.id,
      });
    }
    challengerBattleRoomRecord[gameCategory].push(gameRecord);
    await challengerBattleRoomRecord.save();
  }
}

module.exports = updateWinLossRecords;
