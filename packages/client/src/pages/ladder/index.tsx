/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useGetLadderEntryQuery, useGetLadderPageQuery } from "../../redux/api-slices/ladder-api-slice";
import { CustomErrorDetails, pageSize } from "../../../../common";
import { setAlert } from "../../redux/slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import LadderTableDatum from "../../components/ladder/LadderTableDatum";
import LadderNav from "../../components/ladder/LadderNav";
import { LadderTable } from "../../components/ladder/LadderTable";

function Ladder() {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState("");
  const [viewingSearchedEntry, setViewingSearchedEntry] = useState(false);
  const [currentPageViewing, setCurrentPageViewing] = useState(0);
  const {
    isLoading: ladderPageIsLoading,
    data: ladderPageData,
    isError: ladderPageIsError,
    error: ladderPageError,
  } = useGetLadderPageQuery(currentPageViewing);
  // const {
  //   isLoading: searchedEntryIsLoading,
  //   data: searchedEntryData,
  //   isError: searchedEntryIsError,
  //   error: searchedEntryError,
  // } = useGetLadderEntryQuery(submittedSearchText /* { skip: !submittedSearchText } */);

  useEffect(() => {
    if (ladderPageIsError && ladderPageError && "data" in ladderPageError) {
      const errors: CustomErrorDetails[] = ladderPageError.data as CustomErrorDetails[];
      errors.forEach((currError) => {
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
    }
  }, [ladderPageIsLoading, ladderPageError]);

  // useEffect(() => {
  //   if (searchedEntryError && searchedEntryError && "data" in searchedEntryError) {
  //     const errors: CustomErrorDetails[] = searchedEntryError.data as CustomErrorDetails[];
  //     errors.forEach((currError) => {
  //       dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
  //     });
  //   }
  // }, [searchedEntryIsError, searchedEntryError]);

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText) return setViewingSearchedEntry(false);
    setViewingSearchedEntry(true);
    setSubmittedSearchText(searchText);
  };

  const onTurnPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => {
    setViewingSearchedEntry(false);
    // let newPageVewing = currentPageViewing + (direction === "foreward" ? 1 : -1);
    // if (!ladder.totalNumberOfPages) return;
    // if (newPageVewing === 0) newPageVewing = ladder.totalNumberOfPages;
    // if (newPageVewing > ladder.totalNumberOfPages) newPageVewing = 1;
    // setCurrentPageViewing(newPageVewing);
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

  // const searchedUserToShow = searchedEntryIsError ? (
  //   <tr>
  //     <td>...</td>
  //   </tr>
  // ) : (
  //   searchedEntryData && <LadderTableDatum key={searchedEntryData.name} entry={searchedEntryData} />
  // );

  return (
    <section className="page-frame">
      <div className="page-basic">
        <h1 className="header-basic">LADDER</h1>
        <LadderNav
          searchText={searchText}
          setSearchText={setSearchText}
          onTurnPage={onTurnPage}
          currentPageViewing={currentPageViewing}
          handleSubmit={handleSubmitSearch}
        />
        <LadderTable ladderEntriesToShow={ladderEntriesToShow} />
      </div>
    </section>
  );
}

export default Ladder;
