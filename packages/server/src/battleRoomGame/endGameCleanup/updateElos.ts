import { PlayerRole } from "@lucella/common";
import { IBattleRoomRecord } from "../../models/BattleRoomRecord";

export default function updateElos(hostBattleRoomRecord: IBattleRoomRecord, challengerBattleRoomRecord: IBattleRoomRecord, winnerRole: PlayerRole) {
  const hostElo = hostBattleRoomRecord.elo;
  const challengerElo = challengerBattleRoomRecord.elo;
  let newHostElo: number, newChallengerElo: number;
  let hostS: number, challengerS: number;
  const hostR = 10 ^ (hostElo / 400);
  const challengerR = 10 ^ (challengerElo / 400);
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
  newHostElo = Math.round(hostElo + 32 * (hostS! - hostE));
  newChallengerElo = Math.round(challengerElo + 32 * (challengerS! - challengerE));
  return { hostElo, challengerElo, newHostElo, newChallengerElo };
}
