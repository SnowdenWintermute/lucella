import React from "react";
import styles from "./ladder-components.module.scss";

type Props = {
  ladderEntriesToShow: JSX.Element | JSX.Element[] | undefined;
};

export function LadderTable({ ladderEntriesToShow }: Props) {
  return (
    <table className={styles["ladder-table"]}>
      <tbody className={styles["ladder-table-body"]}>
        <tr className={styles["ladder-table-row"]}>
          <td className={styles["ladder-table-datum"]}>Rank</td>
          <td className={`${styles["ladder-table-datum"]} ${styles["ladder-table-datum-username"]}`}>Name</td>
          <td className={styles["ladder-table-datum"]}>Elo</td>
          <td className={styles["ladder-table-datum"]}>Wins</td>
          <td className={styles["ladder-table-datum"]}>Losses</td>
          <td className={styles["ladder-table-datum"]}>Win Rate</td>
        </tr>

        {ladderEntriesToShow}
      </tbody>
    </table>
  );
}
