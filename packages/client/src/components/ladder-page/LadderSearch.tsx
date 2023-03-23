import React from "react";
import { BUTTON_NAMES } from "../../consts/button-names";

type Props = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function LadderSearch({ searchText, setSearchText, handleSubmit }: Props) {
  return (
    <form className="ladder__search-form" onSubmit={handleSubmit}>
      <label htmlFor="ladder-search-input" className="ladder__search-input-label">
        <input
          className="input input--transparent ladder__search-input"
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
      <button type="submit" className="button button-primary ladder__search-button">
        {BUTTON_NAMES.GENERAL.SEARCH}
      </button>
    </form>
  );
}

export default LadderSearch;
