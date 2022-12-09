import { PlayerRole } from "../../../../../common";
import { IBattleRoomRecord } from "../../../models/BattleRoomRecord";

export default function updateWinLossRecords(winnerRole: PlayerRole, hostBattleRoomRecord: IBattleRoomRecord, challengerBattleRoomRecord: IBattleRoomRecord) {
  if (winnerRole === PlayerRole.HOST) {
    hostBattleRoomRecord.wins = hostBattleRoomRecord.wins + 1;
    challengerBattleRoomRecord.losses = challengerBattleRoomRecord.losses + 1;
  }
  if (winnerRole === PlayerRole.CHALLENGER) {
    challengerBattleRoomRecord.wins = challengerBattleRoomRecord.wins + 1;
    hostBattleRoomRecord.losses = hostBattleRoomRecord.losses + 1;
  }

  hostBattleRoomRecord.winrate = (hostBattleRoomRecord.wins / (hostBattleRoomRecord.losses + hostBattleRoomRecord.wins)) * 100;
  challengerBattleRoomRecord.winrate = (challengerBattleRoomRecord.wins / (challengerBattleRoomRecord.losses + challengerBattleRoomRecord.wins)) * 100;
}
