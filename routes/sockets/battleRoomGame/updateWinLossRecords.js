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
  if (isRanked) {
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
        challengerBattleRoomRecord.losses =
          challengerBattleRoomRecord.losses + 1;
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
        challengerElo + 32 * (challengerS - challengerE)
      );

      hostBattleRoomRecord.winrate =
        (hostBattleRoomRecord.wins /
          (hostBattleRoomRecord.losses + hostBattleRoomRecord.wins)) *
        100;
      challengerBattleRoomRecord.winrate =
        (challengerBattleRoomRecord.wins /
          (challengerBattleRoomRecord.losses +
            challengerBattleRoomRecord.wins)) *
        100;

      // create the game records
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
      // add game record
      await gameRecord.save();

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
            challengerBattleRoomRecord.id
          );
        } else {
          ladder.ladder.push(
            challengerBattleRoomRecord.id,
            hostBattleRoomRecord.id
          );
        }
      }
      oldHostRank = ladder.ladder.findIndex(
        (i) => i.id === hostBattleRoomRecord.id
      );
      oldChallengerRank = ladder.ladder.findIndex(
        (i) => i.id === challengerBattleRoomRecord.id
      );
      console.log("old host rank: " + oldHostRank);
      console.log("old challenger rank: " + oldChallengerRank);
      if (oldHostRank === -1) {
        console.log("adding host to ladder");
        ladder.ladder.push(hostBattleRoomRecord.id);
      }
      if (oldChallengerRank === -1) {
        console.log("adding challenger to ladder");
        ladder.ladder.push(challengerBattleRoomRecord.id);
      }
      ladder.ladder.sort((a, b) => {
        return b.elo - a.elo;
      });
      newHostRank = ladder.ladder.findIndex(
        (i) => i.id === hostBattleRoomRecord.id
      );
      newChallengerRank = ladder.ladder.findIndex(
        (i) => i.id === challengerBattleRoomRecord.id
      );

      await ladder.save();

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
    } else {
      return {
        casualGame: true,
      };
    }
  }
}

module.exports = updateWinLossRecords;
