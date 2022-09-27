import { PlayerRole } from "../../../../../../common";
import { IBattleRoomRecord } from "../../../../models/BattleRoomRecord";

export default function (
  winnerRole: PlayerRole,
  hostBattleRoomRecord: IBattleRoomRecord,
  challengerBattleRoomRecord: IBattleRoomRecord
) {
  if (winnerRole === "host") {
    hostBattleRoomRecord.wins = hostBattleRoomRecord.wins + 1;
    challengerBattleRoomRecord.losses = challengerBattleRoomRecord.losses + 1;
  }
  if (winnerRole === "challenger") {
    challengerBattleRoomRecord.wins = challengerBattleRoomRecord.wins + 1;
    hostBattleRoomRecord.losses = hostBattleRoomRecord.losses + 1;
  }

  hostBattleRoomRecord.winrate =
    (hostBattleRoomRecord.wins / (hostBattleRoomRecord.losses + hostBattleRoomRecord.wins)) * 100;
  challengerBattleRoomRecord.winrate =
    (challengerBattleRoomRecord.wins / (challengerBattleRoomRecord.losses + challengerBattleRoomRecord.wins)) * 100;
}
