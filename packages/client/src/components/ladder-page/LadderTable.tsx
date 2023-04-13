import React from "react";
import { ARIA_LABELS } from "../../consts/aria-labels";

type Props = {
  ladderEntriesToShow: JSX.Element | JSX.Element[] | undefined;
};

export function LadderTable({ ladderEntriesToShow }: Props) {
  return (
    <table className="ladder__table" aria-label={ARIA_LABELS.LADDER.TABLE}>
      <tbody className="ladder__table-headers-body">
        <tr className="ladder__table-row">
          <th className="ladder__table-datum">Rank</th>
          <th className="ladder__table-datum">Name</th>
          <th className="ladder__table-datum">Elo</th>
          <th className="ladder__table-datum">Wins</th>
          <th className="ladder__table-datum">Losses</th>
          <th className="ladder__table-datum">Win Rate</th>
        </tr>
      </tbody>
      <tbody className="ladder__table-body">{ladderEntriesToShow}</tbody>
    </table>
  );
}
