import React, { useEffect, useState, Fragment } from "react";
import { useAppSelector } from "../../redux/hooks";
import { usersApi } from "../../redux/api-slices/users-api-slice";

function ScoreScreenModalContents() {
  const user = usersApi.endpoints.getMe.useQueryState(null, { selectFromResult: ({ data }) => data! });
  const [eloAnimatedChangeClass, setEloAnimatedChangeClass] = useState("elo-animate-1");
  const [eloAnimatedChange, setEloAnimatedChange] = useState<number | null>();
  const scoreScreenData = useAppSelector((state) => state.lobbyUi.scoreScreenData);

  let playerOldElo: number | null = null;
  let playerNewElo: number | null = null;
  let playerOldRank = null;
  let playerNewRank = null;
  let eloDiff: number | null = null;

  if (scoreScreenData && scoreScreenData.gameRoom) {
    playerOldElo =
      scoreScreenData.gameRoom!.players!.challenger!.associatedUser.username === user?.name
        ? scoreScreenData.eloUpdates?.challengerElo
        : scoreScreenData.eloUpdates?.hostElo;
    playerNewElo =
      scoreScreenData!.gameRoom!.players!.challenger!.associatedUser.username === user?.name
        ? scoreScreenData.eloUpdates?.newChallengerElo
        : scoreScreenData.eloUpdates?.newHostElo;
    playerOldRank =
      scoreScreenData!.gameRoom!.players!.challenger!.associatedUser.username === user?.name
        ? scoreScreenData.eloUpdates?.oldChallengerRank
        : scoreScreenData.eloUpdates?.oldHostRank;
    playerNewRank =
      scoreScreenData!.gameRoom!.players!.challenger!.associatedUser.username === user?.name
        ? scoreScreenData.eloUpdates?.newChallengerRank
        : scoreScreenData.eloUpdates?.newHostRank;
    eloDiff = playerNewElo - playerOldElo;
  }

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) setEloAnimatedChange(playerOldElo);
    return () => {
      didCancel = true;
    };
  }, [playerOldElo]);

  useEffect(() => {
    const animateTimeoutOne = setTimeout(() => {
      if (!eloDiff) return;
      const newEloAnimateClass = Math.sign(eloDiff) === 1 ? "elo-animate-2-win" : "elo-animate-2-loss";
      setEloAnimatedChangeClass(newEloAnimateClass);
    }, 1000);
    const animateTimeoutTwo = setTimeout(() => {
      setEloAnimatedChange(playerNewElo);
    }, 1300);
    const animateTimeoutThree = setTimeout(() => {
      setEloAnimatedChangeClass("elo-animate-3");
    }, 3000);
    return () => {
      clearTimeout(animateTimeoutOne);
      clearTimeout(animateTimeoutTwo);
      clearTimeout(animateTimeoutThree);
    };
  }, [eloDiff, playerNewElo]);

  if (!scoreScreenData) return <div>Error - no score screen data received</div>;
  return (
    <div data-cy="score-screen-modal">
      <h3>Game {scoreScreenData!.gameRoom.gameName} final score:</h3>
      <table>
        <tbody>
          <tr>
            <td>{scoreScreenData!.gameRoom!.players!.host!.associatedUser.username}:</td>
            <td>{scoreScreenData!.game.score.host}</td>
          </tr>
          <tr>
            <td>{scoreScreenData!.gameRoom!.players!.challenger!.associatedUser.username}:</td>
            <td>{scoreScreenData!.game.score.challenger}</td>
          </tr>
          {!scoreScreenData!.eloUpdates ? (
            <tr>
              <td>No changes to ladder rating</td>
            </tr>
          ) : (
            <>
              <tr>
                <td className={eloAnimatedChangeClass}>Elo: {eloAnimatedChange}</td>
                <td className={eloAnimatedChangeClass}>
                  {eloDiff &&
                    `(${Math.sign(eloDiff) === 1 ? "+" : ""}
              ${eloDiff})`}
                </td>
              </tr>
              {playerOldRank !== playerNewRank ? (
                <tr>
                  <td className="">Rank:</td>
                  <td className="">
                    {playerOldRank && playerOldRank + 1 === 0 ? "Unranked" : playerOldRank && playerOldRank + 1}
                    {` -> `}
                    {playerNewRank && playerNewRank + 1}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>Rank:</td>
                  <td>
                    {playerOldRank && playerOldRank + 1}
                    {` (unchanged)`}
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreScreenModalContents;
