import React from "react";
import { BattleRoomLadderEntry } from "../../../../common";

type Props = {
  entry: BattleRoomLadderEntry;
};

function LadderTableRow({ entry }: Props) {
  return (
    <tr className="ladder__table-row">
      <td className="ladder__table-datum">{entry.rank}</td>
      <td className="ladder__table-datum">{entry.name}</td>
      <td className="ladder__table-datum">{entry.elo}</td>
      <td className="ladder__table-datum">{entry.wins}</td>
      <td className="ladder__table-datum">{entry.losses}</td>
      <td className="ladder__table-datum">
        {entry.wins + entry.losses === 0 ? "No games played" : `${Math.round((entry.wins / (entry.wins + entry.losses)) * 100)}%`}
      </td>
    </tr>
  );
}

export default LadderTableRow;
