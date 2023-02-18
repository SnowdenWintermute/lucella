import React from "react";
import { BattleRoomLadderEntry } from "../../../../common";
import styles from "./ladder-components.module.scss";

type Props = {
  entry: BattleRoomLadderEntry;
  rank: number;
};

function LadderTableDatum({ entry, rank }: Props) {
  return (
    <tr className={styles["ladder-table-row"]}>
      <td className={styles["ladder-table-datum"]}>{rank}</td>
      <td className={styles["ladder-table-datum"]}>{entry.name}</td>
      <td className={styles["ladder-table-datum"]}>{entry.elo}</td>
      <td className={styles["ladder-table-datum"]}>{entry.wins}</td>
      <td className={styles["ladder-table-datum"]}>{entry.losses}</td>
      <td className={styles["ladder-table-datum"]}>{Math.round((entry.wins / (entry.wins + entry.losses)) * 100)}</td>
    </tr>
  );
}

export default LadderTableDatum;
