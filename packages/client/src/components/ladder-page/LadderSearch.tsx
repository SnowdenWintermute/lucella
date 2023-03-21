import React from "react";
import { BUTTON_NAMES } from "../../consts/button-names";
import styles from "./ladder-components.module.scss";

type Props = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function LadderSearch({ searchText, setSearchText, handleSubmit }: Props) {
  return (
    <form className={styles["ladder__search-form"]} onSubmit={handleSubmit}>
      <label htmlFor="ladder-search-input" className={styles["ladder__search-input-label"]}>
        <input
          className={`input input--transparent ${styles["ladder__search-input"]}`}
          id="ladder-search-input"
          name="Search"
          aria-label="ladder search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          placeholder="Enter a username..."
        />
      </label>
      <button type="submit" className={`button button-primary ${styles["ladder__search-button"]}`}>
        {BUTTON_NAMES.GENERAL.SEARCH}
      </button>
    </form>
  );
}

export default LadderSearch;
