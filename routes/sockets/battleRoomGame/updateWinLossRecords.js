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
  console.log("winner: " + winner);
  console.log("loser: " + loser);
  // determine score
  const winnerRole =
    gameRoom.players.host.username === winner ? "host" : "challenger";
  const loserRole =
    gameRoom.players.challenger.username === winner ? "host" : "challenger";
  const winnerScore = gameData.score[winnerRole];
  const loserScore = gameData.score[loserRole];

  // determine if both players have accounts in the database
  const hostDbRecord = await User.findOne({
    name: gameRoom.players.host.username,
  });
  const challengerDbRecord = await User.findOne({
    name: gameRoom.players.challenger.username,
  });
  // if both players are registered users, update their win loss records
  if (hostDbRecord && challengerDbRecord) {
    // check for and if needed, create game history entrys
    // for host
    let hostBattleRoomRecord = await BattleRoomRecord.findOne({
      user: hostDbRecord.id,
    });
    if (!hostBattleRoomRecord) {
      hostBattleRoomRecord = new BattleRoomRecord({
        user: hostDbRecord.id,
      });
    }
    // for challenger
    let challengerBattleRoomRecord = await BattleRoomRecord.findOne({
      user: challengerDbRecord.id,
    });
    if (!challengerBattleRoomRecord) {
      challengerBattleRoomRecord = new BattleRoomRecord({
        user: challengerDbRecord.id,
      });
    }

    // update w/l, elo and winrates
    // calculate elos
    const hostElo = hostBattleRoomRecord.elo;
    const challengerElo = challengerBattleRoomRecord.elo;
    let newHostElo, newChallengerElo;
    // for host
    if (winnerRole === "host") {
      hostBattleRoomRecord.wins = hostBattleRoomRecord.wins + 1;
      challengerBattleRoomRecord.losses = challengerBattleRoomRecord.losses + 1;
      newHostElo =
        hostElo + 32 * (1 - (10 ^ (hostElo / 400)) / (hostElo + challengerElo));
      newChallengerElo =
        challengerElo +
        32 * (0 - (10 ^ (challengerElo / 400)) / (challengerElo + hostElo));
    }
    if (winnerRole === "challenger") {
      challengerBattleRoomRecord.wins = challengerBattleRoomRecord.wins + 1;
      hostBattleRoomRecord.losses = hostBattleRoomRecord.losses + 1;
      newHostElo =
        hostElo + 32 * (0 - (10 ^ (hostElo / 400)) / (hostElo + challengerElo));
      newChallengerElo =
        challengerElo +
        32 * (1 - (10 ^ (challengerElo / 400)) / (challengerElo + hostElo));
    }
    hostBattleRoomRecord.winrate =
      ((hostBattleRoomRecord.wins + hostBattleRoomRecord.losses) / 2) * 100;
    challengerBattleRoomRecord.winrate =
      ((challengerBattleRoomRecord.wins + challengerBattleRoomRecord.losses) /
        2) *
      100;

    // create the game records
    const gameRecordForHost = new BattleRoomGameRecord({
      winner: {
        winner,
        elo:
          winnerRole === "host"
            ? hostBattleRoomRecord.elo
            : challengerBattleRoomRecord.elo,
      },
      loser: {
        loser,
        elo:
          loserRole === "host"
            ? hostBattleRoomRecord.elo
            : challengerBattleRoomRecord.elo,
      },
      winnerScore,
      loserScore,
      eloChange: newHostElo - hostBattleRoomRecord.elo,
    });
    const gameRecordForChallenger = new BattleRoomGameRecord({
      winner: {
        winner,
        elo:
          winnerRole === "host"
            ? hostBattleRoomRecord.elo
            : challengerBattleRoomRecord.elo,
      },
      loser: {
        loser,
        elo:
          loserRole === "host"
            ? hostBattleRoomRecord.elo
            : challengerBattleRoomRecord.elo,
      },
      winnerScore,
      loserScore,
      eloChange: newChallengerElo - challengerBattleRoomRecord.elo,
    });
    const gameCategory = isRanked ? "rankedGames" : "casualGames";
    // add game records
    challengerBattleRoomRecord[gameCategory].push(gameRecordForChallenger);
    hostBattleRoomRecord[gameCategory].push(gameRecordForHost);

    // update to new elo values
    hostBattleRoomRecord.elo = newHostElo;
    challengerBattleRoomRecord.elo = newChallengerElo;

    await hostBattleRoomRecord.save();
    await challengerBattleRoomRecord.save();
  }
}

module.exports = updateWinLossRecords;
