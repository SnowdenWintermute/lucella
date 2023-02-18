import React from "react";
import { BUTTON_NAMES } from "../../consts/button-names";
import styles from "./ladder-components.module.scss";

type Props = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  onTurnPage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => void;
  currentPageViewing: number;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function LadderNav({ searchText, setSearchText, onTurnPage, currentPageViewing, handleSubmit }: Props) {
  return (
    <section className={styles["ladder-nav"]}>
      <form className={styles["ladder-search"]} onSubmit={handleSubmit}>
        <label htmlFor="ladder-search-input">
          <input
            className={`simple-text-input ${styles["ladder-search-input"]}`}
            id="ladder-search-input"
            name="Search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            placeholder="Enter a username..."
          />
          <button type="button" className={`button button-primary ${styles["ladder-search-button"]}`}>
            {BUTTON_NAMES.GENERAL.SEARCH}
          </button>
        </label>
      </form>
      <div className={styles["ladder-page-buttons"]}>
        <button
          type="button"
          className={`button button-basic ${styles["ladder-page-button"]}`}
          onClick={(e) => {
            onTurnPage(e, "back");
          }}
        >{`<`}</button>
        <span className={styles["ladder-current-page-number-holder"]}>
          <div className={styles["ladder-current-page-number"]}>{currentPageViewing + 1}</div>
        </span>
        <button
          type="button"
          className={`button button-basic ${styles["ladder-page-button"]}`}
          onClick={(e) => {
            onTurnPage(e, "foreward");
          }}
        >{`>`}</button>
      </div>
    </section>
  );
}

export default LadderNav;
