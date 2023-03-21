import React from "react";
import styles from "./ladder-components.module.scss";
import ArrowButtonIcon from "../../img/menu-icons/arrow-button-icon.svg";

type Props = {
  onTurnPage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => void;
  currentPageViewing: number;
};

export function LadderPaginationButtons({ onTurnPage, currentPageViewing }: Props) {
  return (
    <div className={styles["ladder__pagination-buttons"]}>
      <button
        type="button"
        className={`button button-basic ${styles["ladder__pagination-button"]}`}
        data-cy="ladder-page-back"
        aria-label="page back"
        onClick={(e) => {
          onTurnPage(e, "back");
        }}
      >
        <ArrowButtonIcon className={styles["ladder__pagination-button-arrow-svg"]} />
      </button>
      <div className={styles["ladder-current-page-number-holder"]}>
        <span className={styles["ladder__current-page-number"]} data-cy="ladder-current-page" aria-label="current page">
          Page {currentPageViewing + 1}
        </span>
      </div>
      <button
        type="button"
        className={`button button-basic ${styles["ladder__pagination-button"]}`}
        data-cy="ladder-page-forward"
        aria-label="page forward"
        onClick={(e) => {
          onTurnPage(e, "foreward");
        }}
      >
        <ArrowButtonIcon className={styles["ladder__pagination-button-arrow-svg"]} />
      </button>
    </div>
  );
}
