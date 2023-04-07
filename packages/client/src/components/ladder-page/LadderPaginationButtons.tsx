import React from "react";
import { ARIA_LABELS } from "../../consts/aria-labels";
import { LOBBY_TEXT } from "../../consts/lobby-text";
import ArrowButtonIcon from "../../img/menu-icons/arrow-button-icon.svg";

type Props = {
  onTurnPage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => void;
  currentPageViewing: number;
};

export function LadderPaginationButtons({ onTurnPage, currentPageViewing }: Props) {
  return (
    <div className="ladder__pagination-buttons">
      <button
        type="button"
        className="button button-basic ladder__pagination-button"
        aria-label={ARIA_LABELS.LADDER.PREVIOUS_PAGE}
        onClick={(e) => {
          onTurnPage(e, "back");
        }}
      >
        <ArrowButtonIcon className="ladder__pagination-button-arrow-svg" />
      </button>
      <div className="ladder-current-page-number-holder">
        <span className="ladder__current-page-number" aria-label={ARIA_LABELS.LADDER.CURRENT_PAGE}>
          {LOBBY_TEXT.LADDER.PAGE_NUMBER_PREFIX}
          {currentPageViewing + 1}
        </span>
      </div>
      <button
        type="button"
        className="button button-basic ladder__pagination-button"
        aria-label={ARIA_LABELS.LADDER.NEXT_PAGE}
        onClick={(e) => {
          onTurnPage(e, "foreward");
        }}
      >
        <ArrowButtonIcon className="ladder__pagination-button-arrow-svg" />
      </button>
    </div>
  );
}
