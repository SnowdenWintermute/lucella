import { IBattleRoomScoreCard, PlayerRole } from "../../../../common";

export default function updateElos(hostBattleRoomScoreCard: IBattleRoomScoreCard, challengerBattleRoomScoreCard: IBattleRoomScoreCard, winnerRole: PlayerRole) {
  const hostElo = hostBattleRoomScoreCard.elo;
  const challengerElo = challengerBattleRoomScoreCard.elo;
  let hostS: number;
  let challengerS: number;
  const hostR = 10 ** (hostElo / 400);
  const challengerR = 10 ** (challengerElo / 400);
  const hostE = hostR / (hostR + challengerR);
  const challengerE = challengerR / (hostR + challengerR);
  if (winnerRole === PlayerRole.HOST) {
    hostS = 1;
    challengerS = 0;
  }
  if (winnerRole === PlayerRole.CHALLENGER) {
    hostS = 0;
    challengerS = 1;
  }
  const newHostElo = Math.round(hostElo + 32 * (hostS! - hostE));
  const newChallengerElo = Math.round(challengerElo + 32 * (challengerS! - challengerE));
  return { hostElo, challengerElo, newHostElo, newChallengerElo };
}
