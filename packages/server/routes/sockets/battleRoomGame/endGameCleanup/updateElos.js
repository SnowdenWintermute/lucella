module.exports = ({
  hostBattleRoomRecord,
  challengerBattleRoomRecord,
  winnerRole,
}) => {
  const hostElo = hostBattleRoomRecord.elo;
  const challengerElo = challengerBattleRoomRecord.elo;
  let newHostElo, newChallengerElo;
  let hostS, challengerS;
  const hostR = 10 ^ (hostElo / 400);
  const challengerR = 10 ^ (challengerElo / 400);
  const hostE = hostR / (hostR + challengerR);
  const challengerE = challengerR / (hostR + challengerR);
  if (winnerRole === "host") {
    hostS = 1;
    challengerS = 0;
  }
  if (winnerRole === "challenger") {
    hostS = 0;
    challengerS = 1;
  }
  newHostElo = Math.round(hostElo + 32 * (hostS - hostE));
  newChallengerElo = Math.round(
    challengerElo + 32 * (challengerS - challengerE)
  );
  return [hostElo, challengerElo, newHostElo, newChallengerElo];
};
