import React from "react";
import { BattleRoomLadderEntry } from "../../../../common/src";

type Props = {
  entry: BattleRoomLadderEntry;
  rank: number;
};

function LadderTableDatum({ entry, rank }: Props) {
  return (
    <tr className="ladder-table-row">
      <td className="ladder-table-datum">{rank}</td>
      <td className="ladder-table-datum">{entry.name}</td>
      <td className="ladder-table-datum">{entry.elo}</td>
      <td className="ladder-table-datum">{entry.wins}</td>
      <td className="ladder-table-datum">{entry.losses}</td>
      <td className="ladder-table-datum">{Math.round((entry.wins / (entry.wins + entry.losses)) * 100)}</td>
    </tr>
  );
}

export default LadderTableDatum;
