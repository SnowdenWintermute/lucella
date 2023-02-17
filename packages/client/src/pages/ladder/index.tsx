/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useGetLadderPageQuery } from "../../redux/api-slices/ladder-api-slice";
import { setViewingSearchedUser } from "../../redux/slices/ladder-slice";
import { CustomErrorDetails, pageSize } from "../../../../common";
import { setAlert } from "../../redux/slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import LadderTableDatum from "../../components/ladder/LadderTableDatum";

function Ladder() {
  const dispatch = useAppDispatch();
  const ladder = useAppSelector((state) => state.ladder);
  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState("");
  const [pageNumberAnimateClass, setPageNumberAnimateClass] = useState("");
  const [currentPageViewing, setCurrentPageViewing] = useState(0);
  const {
    isLoading: ladderPageIsLoading,
    data: ladderPageData,
    isError: ladderPageIsError,
    error: ladderPageError,
  } = useGetLadderPageQuery(currentPageViewing);
  // const {
  //   isLoading: searchedUserIsLoading,
  //   data: searchedUserData,
  //   isError: searchedUserIsError,
  //   error: searchedUserError,
  // } = useGetUserBattleRoomRecordQuery(submittedSearchText, { skip: !submittedSearchText });

  // useEffect(() => {
  //   if (ladderPageIsError && ladderPageError && "data" in ladderPageError) {
  //     const errors: CustomErrorDetails[] = ladderPageError.data as CustomErrorDetails[];
  //     errors.forEach((currError) => {
  //       dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
  //     });
  //   }
  // }, [ladderPageIsLoading, ladderPageError]);

  // useEffect(() => {
  //   if (searchedUserError && searchedUserError && "data" in searchedUserError) {
  //     const errors: CustomErrorDetails[] = searchedUserError.data as CustomErrorDetails[];
  //     errors.forEach((currError) => {
  //       dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
  //     });
  //   }
  // }, [searchedUserIsError, searchedUserError]);

  // const onSearchUserRecord = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!searchText) return dispatch(setViewingSearchedUser(false));
  //   dispatch(setViewingSearchedUser(true));
  //   setSubmittedSearchText(searchText);
  // };

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
      <td>...</td>
    </tr>
  ) : (
    ladderPageData &&
    ladderPageData.pageData &&
    ladderPageData.pageData.map((entry, i) => <LadderTableDatum key={entry.name} entry={entry} rank={i + currentPageViewing * pageSize + 1} />)
  );

  // const searchedUserToShow = searchedUserIsLoading ? (
  //   <tr>
  //     <td>...</td>
  //   </tr>
  // ) : (
  //   searchedUserData?.user && (
  //     <tr key={searchedUserData.user.name} className="ladder-table-row">
  //       <td className="ladder-table-datum">{searchedUserData.rank.toString()}</td>
  //       <td className="ladder-table-datum">{searchedUserData.user.name}</td>
  //       <td className="ladder-table-datum">{searchedUserData.elo}</td>
  //       <td className="ladder-table-datum">{searchedUserData.wins}</td>
  //       <td className="ladder-table-datum">{searchedUserData.losses}</td>
  //       <td className="ladder-table-datum">{Math.round(searchedUserData.winrate)}%</td>
  //     </tr>
  //   )
  // );

  return (
    <section className="page-frame">
      <div className="page-basic">
        <h1 className="header-basic">LADDER</h1>
        <section className="ladder-nav">
          <form
            className="ladder-search"
            onSubmit={(e) => {
              // onSearchUserRecord(e);
            }}
          >
            <label htmlFor="ladder-search-input">
              <input
                className="simple-text-input ladder-search-input"
                id="ladder-search-input"
                name="Search"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                placeholder="Enter a username..."
              />
              <button type="button" className="button button-primary ladder-search-button">
                Search
              </button>
            </label>
          </form>
          <div className="ladder-page-buttons">
            <button
              type="button"
              className="button button-basic ladder-page-button"
              onClick={(e) => {
                onTurnPage(e, "back");
              }}
            >{`<`}</button>
            <span className="ladder-current-page-number-holder">
              <div className={`ladder-current-page-number ${pageNumberAnimateClass}`}>{currentPageViewing + 1}</div>
            </span>
            <button
              type="button"
              className="button button-basic ladder-page-button"
              onClick={(e) => {
                onTurnPage(e, "foreward");
              }}
            >{`>`}</button>
          </div>
        </section>
        <table className="ladder-table">
          <tbody className="ladder-table-body">
            <tr className="ladder-table-row">
              <td className="ladder-table-datum">Rank</td>
              <td className="ladder-table-datum">Name</td>
              <td className="ladder-table-datum">Elo</td>
              <td className="ladder-table-datum">Wins</td>
              <td className="ladder-table-datum">Losses</td>
              <td className="ladder-table-datum">Win Rate</td>
            </tr>
            {!ladder.viewingSearchedUser ? ladderEntriesToShow : "searchedUserToShow"}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Ladder;
