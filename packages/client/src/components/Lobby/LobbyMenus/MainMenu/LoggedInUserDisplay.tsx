import React from "react";
import { ERROR_MESSAGES, SanitizedUser } from "../../../../../../common";
import { useGetLadderEntryQuery } from "../../../../redux/api-slices/ladder-api-slice";

function ScorecardListItem({ title, value }: { title: string; value: any }) {
  return (
    <li className="logged-in-user-display-scorecard-list-item">
      <div className="logged-in-user-display-scorecard-list-item-title">{title}</div>
      <div className="logged-in-user-display-scorecard-list-item-value">{value}</div>
    </li>
  );
}

function LoggedInUserDisplay({ user }: { user: SanitizedUser }) {
  const {
    isLoading: userScorecardIsLoading,
    isFetching: userScorecardIsFetching,
    data: userScorecardData,
    error: userScorecardError,
    refetch: userScorecardRefetch,
  } = useGetLadderEntryQuery(user?.name || "", { refetchOnMountOrArgChange: true });

  let winRate;
  if (userScorecardData) {
    const { ladderEntry } = userScorecardData;
    if (ladderEntry.wins + ladderEntry.losses === 0) winRate = "0.00%";
    else winRate = `${((userScorecardData.ladderEntry.wins / (userScorecardData.ladderEntry.wins + userScorecardData.ladderEntry.losses)) * 100).toFixed(2)}%`;

    if (Number.isNaN(winRate)) winRate = "0.00%";
  }

  return (
    <div className="logged-in-user-display">
      <h4 className="logged-in-user-display__username">{user.name}</h4>
      {userScorecardData && (
        <ul className="logged-in-user-display__scorecard">
          <div className="logged-in-user-display__scorecard-column">
            <ScorecardListItem title="Games Played" value={userScorecardData.ladderEntry.wins + userScorecardData.ladderEntry.losses} />
            <ScorecardListItem title="Elo" value={userScorecardData.ladderEntry.elo} />
          </div>
          <div className="logged-in-user-display__scorecard-column">
            <ScorecardListItem title="Wins" value={userScorecardData.ladderEntry.wins} />
            <ScorecardListItem title="Rank" value={userScorecardData.ladderEntry.rank} />
          </div>
          <div className="logged-in-user-display__scorecard-column">
            <ScorecardListItem title="Losses" value={userScorecardData.ladderEntry.losses} />
            <ScorecardListItem title="Win Rate" value={`${winRate}`} />
          </div>
        </ul>
      )}

      {userScorecardError &&
        "data" in userScorecardError &&
        userScorecardError.data instanceof Array &&
        userScorecardError.data[0].message === ERROR_MESSAGES.LADDER.USER_NOT_FOUND && (
          <p>
            Welcome to Battle School. Once you have participated in ranked play in the Battle Room your stats will be shown here. Good luck and do your best!
          </p>
        )}
      {!userScorecardData &&
        userScorecardError &&
        "data" in userScorecardError &&
        userScorecardError.data instanceof Array &&
        userScorecardError.data[0].message !== ERROR_MESSAGES.LADDER.USER_NOT_FOUND && <p>{userScorecardError.data[0].message}</p>}
      {!userScorecardData && userScorecardError && !("data" in userScorecardError) && <p>Failed to fetch Battle Room scorecard</p>}
    </div>
  );
}

export default LoggedInUserDisplay;
