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
  console.log("winner: "+winner)
  console.log("loser: "+loser)
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
   // determine if record exists
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
    // add game record
    hostBattleRoomRecord[gameCategory].push(gameRecord);

    //update w/l and winrate
    if(winnerRole==="host") hostBattleRoomRecord.wins = hostBattleRoomRecord.wins +1
    if(winnerRole==="challenger") hostBattleRoomRecord.losses = hostBattleRoomRecord.losses +1
    hostBattleRoomRecord.winrate = (hostBattleRoomRecord.wins + hostBattleRoomRecord.losses)/2 * 100
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
    // add game record
    challengerBattleRoomRecord[gameCategory].push(gameRecord);

    //update w/l and winrate
    if(winnerRole==="challenger") challengerBattleRoomRecord.wins = challengerBattleRoomRecord.wins +1
    if(winnerRole==="challenger") challengerBattleRoomRecord.losses = challengerBattleRoomRecord.losses +1
    challengerBattleRoomRecord.winrate = (challengerBattleRoomRecord.wins + challengerBattleRoomRecord.losses)/2 * 100
    await challengerBattleRoomRecord.save();
  }
}

module.exports = updateWinLossRecords;
