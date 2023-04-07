/* eslint-disable consistent-return */
import React, { useState } from "react";
import { useGetLadderEntryQuery, useGetLadderPageQuery } from "../../redux/api-slices/ladder-api-slice";
import LadderTableRow from "../../components/ladder-page/LadderTableRow";
import LadderSearch from "../../components/ladder-page/LadderSearch";
import { LadderTable } from "../../components/ladder-page/LadderTable";
import { LadderPaginationButtons } from "../../components/ladder-page/LadderPaginationButtons";
import LoadingSpinner from "../../components/common-components/LoadingSpinner";
import { ARIA_LABELS } from "../../consts/aria-labels";

function Ladder() {
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
    error: searchedEntryError,
    refetch: searchedEntryRefetch,
  } = useGetLadderEntryQuery(submittedSearchText, { refetchOnMountOrArgChange: true, skip: !submittedSearchText });

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText) return setViewingSearchedEntry(false);
    setViewingSearchedEntry(true);
    setSubmittedSearchText(searchText);
    if (searchedEntryData) searchedEntryRefetch();
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
    <tr className="ladder__table-row" aria-label={ARIA_LABELS.LADDER.FETCHING_LADDER_ENTRIES}>
      <td className="ladder__loading-spinner-td">
        <LoadingSpinner extraStyles="ladder__loading-spinner" />
      </td>
    </tr>
  );

  if (viewingSearchedEntry) {
    if (searchedEntryError)
      ladderEntriesToShow = (
        <tr className="ladder__table-row">
          {/* @ts-ignore */}
          <td className="ladder__error-td">{searchedEntryError?.data[0].message}</td>
        </tr>
      );
    if (searchedEntryData && !searchedEntryIsLoading && !searchedEntryIsFetching && !searchedEntryError)
      ladderEntriesToShow = <LadderTableRow entry={searchedEntryData.ladderEntry} />;
  } else if (!viewingSearchedEntry && ladderPageData && !ladderPageIsLoading && !ladderPageIsFetching && !ladderPageError) {
    ladderEntriesToShow = ladderPageData.pageData.map((entry) => <LadderTableRow key={entry.name} entry={entry} />);
    // for (let i = 30; i > 0; i -= 1)
    //   ladderEntriesToShow.push(<LadderTableRow key={i} entry={{ name: "aoeuhtnsaoeuhtnsaoeuhtns", rank: 2391, elo: 4501, wins: 999999, losses: 99999999 }} />);
  } else if (ladderPageIsError) {
    ladderEntriesToShow = (
      <tr className="ladder__table-row">
        {/* @ts-ignore */}
        <td className="ladder__error-td">{ladderPageError?.data[0]?.message || "Error fetching ladder entries"} </td>
      </tr>
    );
  }

  return (
    <section className="page-padded-container">
      <main className="page">
        <div className="page__top-bar">
          <h3 className="page__header">Ladder</h3>
        </div>
        <div className="ladder-page__content">
          <LadderSearch searchText={searchText} setSearchText={setSearchText} handleSubmit={handleSubmitSearch} />
          <LadderTable ladderEntriesToShow={ladderEntriesToShow} />
          <LadderPaginationButtons onTurnPage={onTurnPage} currentPageViewing={currentPageViewing} />
        </div>
      </main>
    </section>
  );
}

export default Ladder;
