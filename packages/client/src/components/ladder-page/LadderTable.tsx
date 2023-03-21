import React from "react";
import styles from "./ladder-components.module.scss";

type Props = {
  ladderEntriesToShow: JSX.Element | JSX.Element[] | undefined;
};

export function LadderTable({ ladderEntriesToShow }: Props) {
  return (
    <table className={styles["ladder__table"]} data-cy="ladder__table">
      <tbody className={styles["ladder__table-headers-body"]}>
        <tr className={styles["ladder__table-row"]}>
          <th className={styles["ladder__table-datum"]}>Rank</th>
          <th className={styles["ladder__table-datum"]}>Name</th>
          <th className={styles["ladder__table-datum"]}>Elo</th>
          <th className={styles["ladder__table-datum"]}>Wins</th>
          <th className={styles["ladder__table-datum"]}>Losses</th>
          <th className={styles["ladder__table-datum"]}>Win Rate</th>
        </tr>
      </tbody>
      <tbody className={styles["ladder__table-body"]}>{ladderEntriesToShow}</tbody>
    </table>
  );
}
