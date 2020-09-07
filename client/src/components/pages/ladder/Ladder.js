import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLadderPage } from "../../../store/actions/ladder";

const Ladder = (props) => {
  const dispatch = useDispatch();
  const ladder = useSelector((state) => state.ladder);
  const [currentPageViewing, setCurrentPageViewing] = useState(1);
  const [searchText, setSearchText] = useState();

  useEffect(() => {
    if (!ladder.ladderPages["1"]) dispatch(getLadderPage(1));
  }, [ladder]);

  const ladderEntriesToShow = ladder.ladderPages[currentPageViewing] ? (
    ladder.ladderPages[currentPageViewing].map((entry) => {
      return (
        <tr className="ladder-table-row">
          <td className="ladder-table-datum">
            {ladder.ladderPages[currentPageViewing].indexOf(entry) +
              (currentPageViewing - 1) * 10}
          </td>
          <td className="ladder-table-datum">{entry.user.name}</td>
          <td className="ladder-table-datum">{entry.elo}</td>
          <td className="ladder-table-datum">{entry.wins}</td>
          <td className="ladder-table-datum">{entry.losses}</td>
          <td className="ladder-table-datum">{Math.round(entry.winrate)}%</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td className="ladder-table-datum">...</td>
    </tr>
  );

  return (
    <div className="page-basic">
      <h1 className="header-basic">LADDER</h1>
      <section className="ladder-nav">
        <form className="ladder-search">
          <input
            className={"simple-text-input ladder-search-input"}
            id="ladder-search-input"
            name="Search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            placeholder={"Enter a username..."}
          ></input>
          <label for="ladder-search-input" className={"ladder-search-icon"}>
            Search
          </label>
        </form>
        <div className="ladder-page-buttons">
          <button className="button button-basic ladder-page-button">{`<`}</button>
          <button
            className={"button button-basic ladder-page-button"}
          >{`>`}</button>
        </div>
      </section>
      <table className={"ladder-table"}>
        <tbody className="ladder-table-body">
          <tr className="ladder-table-row">
            <td className="ladder-table-datum">Rank</td>
            <td className="ladder-table-datum">Name</td>
            <td className="ladder-table-datum">Elo</td>
            <td className="ladder-table-datum">Wins</td>
            <td className="ladder-table-datum">Losses</td>
            <td className="ladder-table-datum">Winrate</td>
          </tr>
          {ladderEntriesToShow}
        </tbody>
      </table>
    </div>
  );
};

export default Ladder;
