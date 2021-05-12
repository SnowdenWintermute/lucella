import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLadderPage,
  changeLadderPageViewing,
  getBattleRoomUserRecord,
} from "../../../store/actions/ladder";

const Ladder = (props) => {
  const dispatch = useDispatch();
  const ladder = useSelector((state) => state.ladder);
  const [searchText, setSearchText] = useState("");
  const [pageNumberAnimateClass, setPageNumberAnimateClass] = useState("");

  useEffect(() => {
    if (!ladder.ladderPages["1"]) dispatch(getLadderPage(1));
  }, [ladder, dispatch]);

  const onSearchUserRecord = (e) => {
    e.preventDefault();
    if (!searchText) dispatch(getLadderPage(1))
    else dispatch(getBattleRoomUserRecord(searchText));
  };

  const onTurnPage = (e, direction) => {
    let newPageVewing =
      ladder.currentPage + (direction === "foreward" ? 1 : -1);
    if (newPageVewing === 0) newPageVewing = ladder.totalNumberOfPages;
    if (newPageVewing > ladder.totalNumberOfPages) newPageVewing = 1;
    dispatch(changeLadderPageViewing(newPageVewing));
    if (!ladder.ladderPages[newPageVewing])
      dispatch(getLadderPage(newPageVewing));
    setPageNumberAnimateClass("ladder-current-page-number-animate");
    setTimeout(() => {
      setPageNumberAnimateClass("");
    }, 100);
  };

  const ladderEntriesToShow = ladder.ladderPages[ladder.currentPage] ? (
    ladder.ladderPages[ladder.currentPage].map((entry) => {
      return (
        <tr key={entry.user.name} className="ladder-table-row">
          <td className="ladder-table-datum">
            {ladder.ladderPages[ladder.currentPage].indexOf(entry) +
              (ladder.currentPage - 1) * 10 +
              1}
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
      <td>{`...`}</td>
    </tr>
  );

  const searchedUserToShow = ladder.searchedUserRecord?.user ? (
    <tr key={ladder.searchedUserRecord.user.name} className="ladder-table-row">
      <td className="ladder-table-datum">{ladder.searchedUserRecord.rank}</td>
      <td className="ladder-table-datum">
        {ladder.searchedUserRecord.user.name}
      </td>
      <td className="ladder-table-datum">{ladder.searchedUserRecord.elo}</td>
      <td className="ladder-table-datum">{ladder.searchedUserRecord.wins}</td>
      <td className="ladder-table-datum">{ladder.searchedUserRecord.losses}</td>
      <td className="ladder-table-datum">
        {Math.round(ladder.searchedUserRecord.winrate)}%
      </td>
    </tr>
  ) : (
    <tr>
      <td>{`...`}</td>
    </tr>
  );

  return (
    <section className="page-frame">
      <div className="page-basic">
        <h1 className="header-basic">LADDER</h1>
        <section className="ladder-nav">
          <form
            className="ladder-search"
            onSubmit={(e) => {
              onSearchUserRecord(e);
            }}
          >
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
            <label htmlFor="ladder-search-input">
              <button className={"button button-primary ladder-search-button"}>
                Search
              </button>
            </label>
          </form>
          <div className="ladder-page-buttons">
            <button
              className="button button-basic ladder-page-button"
              onClick={(e) => {
                onTurnPage(e, "back");
              }}
            >{`<`}</button>
            <span className={"ladder-current-page-number-holder"}>
              <div
                className={`ladder-current-page-number ${pageNumberAnimateClass}`}
              >
                {ladder.currentPage}
              </div>
            </span>
            <button
              className={"button button-basic ladder-page-button"}
              onClick={(e) => {
                onTurnPage(e, "foreward");
              }}
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
              <td className="ladder-table-datum">Win Rate</td>
            </tr>
            {!ladder.viewingSearchedUser
              ? ladderEntriesToShow
              : searchedUserToShow}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Ladder;
