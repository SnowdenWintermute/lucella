/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useGetLadderEntryQuery, useGetLadderPageQuery } from "../../redux/api-slices/ladder-api-slice";
import { CustomErrorDetails } from "../../../../common";
import { setAlert } from "../../redux/slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import LadderTableRow from "../../components/ladder-page/LadderTableRow";
import LadderSearch from "../../components/ladder-page/LadderSearch";
import { LadderTable } from "../../components/ladder-page/LadderTable";
import { LadderPaginationButtons } from "../../components/ladder-page/LadderPaginationButtons";
import styles from "./ladder-page.module.scss";
import ladderComponentStyles from "../../components/ladder-page/ladder-components.module.scss";

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
  } = useGetLadderEntryQuery(submittedSearchText, { refetchOnMountOrArgChange: true, skip: !submittedSearchText });

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
    <tr className={ladderComponentStyles["ladder__table-row"]} data-cy="loading-data">
      <td>...</td>
    </tr>
  );

  if (viewingSearchedEntry) {
    if (searchedEntryError)
      ladderEntriesToShow = (
        <tr className={ladderComponentStyles["ladder__table-row"]}>
          {/* @ts-ignore */}
          <td className={styles["ladder__error-td"]}>{searchedEntryError?.data[0].message}</td>
        </tr>
      );
    if (searchedEntryData && !searchedEntryIsLoading && !searchedEntryIsFetching && !searchedEntryError)
      ladderEntriesToShow = <LadderTableRow entry={searchedEntryData.ladderEntry} />;
  } else if (!viewingSearchedEntry && ladderPageData && !ladderPageIsLoading && !ladderPageIsFetching && !ladderPageError) {
    ladderEntriesToShow = ladderPageData.pageData.map((entry) => <LadderTableRow key={entry.name} entry={entry} />);
    // for (let i = 30; i > 0; i -= 1)
    //   ladderEntriesToShow.push(<LadderTableRow key={i} entry={{ name: "aoeuhtnsaoeuhtnsaoeuhtns", rank: 2391, elo: 4501, wins: 999999, losses: 99999999 }} />);
  }

  // {viewingSearchedEntry && searchedEntryIsError && <div style={{ marginTop: "10px" }}>{searchedEntryError?.data[0].message} </div>}
  return (
    <section className="page-padded-container">
      <main className="page">
        <div className="page__top-bar">
          <h3 className="page__header">Ladder</h3>
        </div>
        <div className={styles["ladder-page__content"]}>
          <LadderSearch searchText={searchText} setSearchText={setSearchText} handleSubmit={handleSubmitSearch} />
          <LadderTable ladderEntriesToShow={ladderEntriesToShow} />
          <LadderPaginationButtons onTurnPage={onTurnPage} currentPageViewing={currentPageViewing} />
        </div>
      </main>
    </section>
  );
}

export default Ladder;
