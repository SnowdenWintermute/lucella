const User = require("../../../models/User");
const BattleRoomRecord = require("../../../models/BattleRoomRecord");
const BattleRoomLadder = require("../../../models/BattleRoomLadder");
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
    let hostS, challengerS;
    const hostR = 10 ^ (hostElo / 400);
    const challengerR = 10 ^ (challengerElo / 400);
    const hostE = hostR / (hostR + challengerR);
    const challengerE = challengerR / (hostR + challengerR);
    // for host
    if (winnerRole === "host") {
      hostBattleRoomRecord.wins = hostBattleRoomRecord.wins + 1;
      challengerBattleRoomRecord.losses = challengerBattleRoomRecord.losses + 1;
      hostS = 1;
      challengerS = 0;
    }
    if (winnerRole === "challenger") {
      challengerBattleRoomRecord.wins = challengerBattleRoomRecord.wins + 1;
      hostBattleRoomRecord.losses = hostBattleRoomRecord.losses + 1;
      hostS = 0;
      challengerS = 1;
    }
    newHostElo = Math.round(hostElo + 32 * (hostS - hostE));
    newChallengerElo = Math.round(
      challengerElo + 32 * (challengerS - challengerE),
    );

    hostBattleRoomRecord.winrate =
      (hostBattleRoomRecord.wins /
        (hostBattleRoomRecord.losses + hostBattleRoomRecord.wins)) *
      100;
    challengerBattleRoomRecord.winrate =
      (challengerBattleRoomRecord.wins /
        (challengerBattleRoomRecord.losses + challengerBattleRoomRecord.wins)) *
      100;

    // create the game records
    const gameRecordForHost = new BattleRoomGameRecord({
      winner: {
        name: winner,
        elo:
          winnerRole === "host"
            ? hostBattleRoomRecord.elo
            : challengerBattleRoomRecord.elo,
      },
      loser: {
        name: loser,
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
        name: winner,
        elo:
          winnerRole === "host"
            ? hostBattleRoomRecord.elo
            : challengerBattleRoomRecord.elo,
      },
      loser: {
        name: loser,
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
    // update ladder
    let ladder = await BattleRoomLadder.findOne({}).populate("ladder");
    let oldHostRank, oldChallengerRank, newHostRank, newChallengerRank;
    if (!ladder) {
      ladder = new BattleRoomLadder();
      if (hostBattleRoomRecord.elo > challengerBattleRoomRecord.elo) {
        ladder.ladder.push(
          hostBattleRoomRecord.id,
          challengerBattleRoomRecord.id,
        );
      } else {
        ladder.ladder.push(
          challengerBattleRoomRecord.id,
          hostBattleRoomRecord.id,
        );
      }
    }
    console.log(ladder);
    oldHostRank = ladder.ladder.findIndex(
      (i) => i.id === hostBattleRoomRecord.id,
    );
    oldChallengerRank = ladder.ladder.findIndex(
      (i) => i.id === challengerBattleRoomRecord.id,
    );
    ladder.ladder.sort((a, b) => {
      console.log(b.elo);
      console.log(a.elo);
      return b.elo - a.elo;
    });
    newHostRank = ladder.ladder.findIndex(
      (i) => i.id === hostBattleRoomRecord.id,
    );
    newChallengerRank = ladder.ladder.findIndex(
      (i) => i.id === challengerBattleRoomRecord.id,
    );

    await ladder.save();

    console.log(newHostRank);
    console.log(newChallengerRank);

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
  }
}

module.exports = updateWinLossRecords;
