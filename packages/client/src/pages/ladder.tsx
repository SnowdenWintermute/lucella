/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { useGetLadderEntryQuery, useGetLadderPageQuery } from "../redux/api-slices/ladder-api-slice";
import { CustomErrorDetails } from "../../../common/dist";
import { setAlert } from "../redux/slices/alerts-slice";
import { Alert } from "../classes/Alert";
import { AlertType } from "../enums";
import LadderTableDatum from "../components/ladder/LadderTableDatum";
import LadderNav from "../components/ladder/LadderNav";
import { LadderTable } from "../components/ladder/LadderTable";

function Ladder() {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState("");
  const [viewingSearchedEntry, setViewingSearchedEntry] = useState(false);
  const [currentPageViewing, setCurrentPageViewing] = useState(0);
  const {
    isLoading: ladderPageIsLoading,
    isFetching: ladderPageIsFetching,
    data: ladderPageData,
    isError: ladderPageIsError,
    error: ladderPageError,
  } = useGetLadderPageQuery(currentPageViewing, { refetchOnMountOrArgChange: true });
  const {
    isLoading: searchedEntryIsLoading,
    isFetching: searchedEntryIsFetching,
    data: searchedEntryData,
    isError: searchedEntryIsError,
    error: searchedEntryError,
    refetch: searchedEntryRefetch,
  } = useGetLadderEntryQuery(submittedSearchText, { skip: !submittedSearchText });

  useEffect(() => {
    if (ladderPageIsError && ladderPageError && "data" in ladderPageError) {
      const errors: CustomErrorDetails[] = ladderPageError.data as CustomErrorDetails[];
      errors.forEach((currError) => {
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
    }
  }, [ladderPageIsLoading, ladderPageError]);

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText) return setViewingSearchedEntry(false);
    setViewingSearchedEntry(true);
    setSubmittedSearchText(searchText);
    if (searchedEntryData) searchedEntryRefetch();
    console.log(searchedEntryData);
  };

  const onTurnPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => {
    setViewingSearchedEntry(false);
    let newPageViewing = currentPageViewing + (direction === "foreward" ? 1 : -1);
    if (!ladderPageData) return;
    if (newPageViewing < 0) newPageViewing = ladderPageData.totalNumberOfPages - 1;
    else if (newPageViewing >= ladderPageData?.totalNumberOfPages) newPageViewing = 0;
    setCurrentPageViewing(newPageViewing);
  };

  let ladderEntriesToShow: JSX.Element | JSX.Element[] = (
    <tr>
      <td>...</td>
    </tr>
  );

  if (viewingSearchedEntry) {
    if (searchedEntryError)
      ladderEntriesToShow = (
        <tr>
          {/* @ts-ignore */}
          <td>{searchedEntryError.data[0].message}</td>
        </tr>
      );
    if (searchedEntryData && !searchedEntryIsLoading && !searchedEntryIsFetching && !searchedEntryError)
      ladderEntriesToShow = <LadderTableDatum entry={searchedEntryData.ladderEntry} />;
  } else if (!viewingSearchedEntry && ladderPageData && !ladderPageIsLoading && !ladderPageIsFetching && !ladderPageError)
    ladderEntriesToShow = ladderPageData.pageData.map((entry, i) => <LadderTableDatum key={entry.name} entry={entry} />);

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
