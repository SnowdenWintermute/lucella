import React from "react";
import { BattleRoomLadderEntry } from "../../../../common";
import styles from "./ladder-components.module.scss";

type Props = {
  entry: BattleRoomLadderEntry;
};

function LadderTableDatum({ entry }: Props) {
  return (
    <tr className={styles["ladder-table-row"]}>
      <td className={styles["ladder-table-datum"]}>{entry.rank}</td>
      <td className={`${styles["ladder-table-datum"]} ${styles["ladder-table-datum-username"]}`}>{entry.name}</td>
      <td className={styles["ladder-table-datum"]}>{entry.elo}</td>
      <td className={styles["ladder-table-datum"]}>{entry.wins}</td>
      <td className={styles["ladder-table-datum"]}>{entry.losses}</td>
      <td className={styles["ladder-table-datum"]}>
        {entry.wins + entry.losses === 0 ? "No games played" : `${Math.round((entry.wins / (entry.wins + entry.losses)) * 100)}%`}
      </td>
    </tr>
  );
}

export default LadderTableDatum;
