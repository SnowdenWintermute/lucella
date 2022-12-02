import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useGetLadderPageQuery, useGetUserBattleRoomRecordQuery } from "../../redux/api-slices/ladder-api-slice";
import { setViewingSearchedUser } from "../../redux/slices/ladder-slice";

const Ladder = () => {
  const dispatch = useAppDispatch();
  const ladder = useAppSelector((state) => state.ladder);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState("");
  const [pageNumberAnimateClass, setPageNumberAnimateClass] = useState("");
  const [currentPageViewing, setCurrentPageViewing] = useState(1);
  const { isLoading: ladderPageIsLoading, data: ladderPageData } = useGetLadderPageQuery(currentPageViewing);
  const { isLoading: searchedUserIsLoading, data: searchedUserData } = useGetUserBattleRoomRecordQuery(submittedSearchText, { skip: !submittedSearchText });

  useEffect(() => {
    searchInputRef.current!.focus();
  }, []);

  const onSearchUserRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText) return dispatch(setViewingSearchedUser(false));
    dispatch(setViewingSearchedUser(true));
    setSubmittedSearchText(searchText);
  };

  const onTurnPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => {
    let newPageVewing = currentPageViewing + (direction === "foreward" ? 1 : -1);
    if (!ladder.totalNumberOfPages) return;
    if (newPageVewing === 0) newPageVewing = ladder.totalNumberOfPages;
    if (newPageVewing > ladder.totalNumberOfPages) newPageVewing = 1;
    setCurrentPageViewing(newPageVewing);
    setPageNumberAnimateClass("ladder-current-page-number-animate");
    setTimeout(() => {
      setPageNumberAnimateClass("");
    }, 100);
  };

  const ladderEntriesToShow = ladderPageIsLoading ? (
    <tr>
      <td>{`...`}</td>
    </tr>
  ) : (
    ladderPageData &&
    ladderPageData.pageData &&
    ladderPageData.pageData.map((entry) => {
      return (
        <tr key={entry.user.name} className="ladder-table-row">
          <td className="ladder-table-datum">{"test"}</td>
          <td className="ladder-table-datum">{entry.user.name}</td>
          <td className="ladder-table-datum">{entry.elo}</td>
          <td className="ladder-table-datum">{entry.wins}</td>
          <td className="ladder-table-datum">{entry.losses}</td>
          <td className="ladder-table-datum">{Math.round(entry.winrate)}%</td>
        </tr>
      );
    })
  );

  const searchedUserToShow = searchedUserIsLoading ? (
    <tr>
      <td>{`...`}</td>
    </tr>
  ) : (
    searchedUserData?.user && (
      <tr key={searchedUserData.user.name} className="ladder-table-row">
        <td className="ladder-table-datum">{searchedUserData.rank.toString()}</td>
        <td className="ladder-table-datum">{searchedUserData.user.name}</td>
        <td className="ladder-table-datum">{searchedUserData.elo}</td>
        <td className="ladder-table-datum">{searchedUserData.wins}</td>
        <td className="ladder-table-datum">{searchedUserData.losses}</td>
        <td className="ladder-table-datum">{Math.round(searchedUserData.winrate)}%</td>
      </tr>
    )
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
              ref={searchInputRef}
            ></input>
            <label htmlFor="ladder-search-input">
              <button className={"button button-primary ladder-search-button"}>Search</button>
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
              <div className={`ladder-current-page-number ${pageNumberAnimateClass}`}>{currentPageViewing}</div>
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
            {!ladder.viewingSearchedUser ? ladderEntriesToShow : searchedUserToShow}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Ladder;
