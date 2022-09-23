import React, { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";

const ScoreScreenModalContents = () => {
  const [eloAnimatedChangeClass, setEloAnimatedChangeClass] = useState(
    "elo-animate-1"
  );
  const [eloAnimatedChange, setEloAnimatedChange] = useState();
  const scoreScreenData = useSelector((state) => state.lobbyUi.scoreScreenData);
  const username = useSelector((state) =>
    state.auth.user ? state.auth.user.name : null
  );

  let playerOldElo, playerNewElo, playerOldRank, playerNewRank;

  if (scoreScreenData.eloUpdates) {
    playerOldElo =
      scoreScreenData.gameRoom.players.challenger.username === username
        ? scoreScreenData.eloUpdates.challengerElo
        : scoreScreenData.eloUpdates.hostElo;
    playerNewElo =
      scoreScreenData.gameRoom.players.challenger.username === username
        ? scoreScreenData.eloUpdates.newChallengerElo
        : scoreScreenData.eloUpdates.newHostElo;
    playerOldRank =
      scoreScreenData.gameRoom.players.challenger.username === username
        ? scoreScreenData.eloUpdates.oldChallengerRank
        : scoreScreenData.eloUpdates.oldHostRank;
    playerNewRank =
      scoreScreenData.gameRoom.players.challenger.username === username
        ? scoreScreenData.eloUpdates.newChallengerRank
        : scoreScreenData.eloUpdates.newHostRank;
  }

  const eloDiff = playerNewElo - playerOldElo;

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) setEloAnimatedChange(playerOldElo);
    return () => {
      didCancel = true;
    };
  }, [playerOldElo]);

  useEffect(() => {
    const animateTimeoutOne = setTimeout(() => {
      const newEloAnimateClass =
        Math.sign(eloDiff) === 1 ? "elo-animate-2-win" : "elo-animate-2-loss";
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

  if (!scoreScreenData.gameData) return <div />;
  return (
    <div>
      <h3>Game {scoreScreenData.gameRoom.gameName} final score:</h3>
      <table>
        <tbody>
          <tr>
            <td>{scoreScreenData.gameRoom.players.host.username}:</td>
            <td>{scoreScreenData.gameData.gameState.score.host}</td>
          </tr>
          <tr>
            <td>{scoreScreenData.gameRoom.players.challenger.username}:</td>
            <td>{scoreScreenData.gameData.gameState.score.challenger}</td>
          </tr>
          {scoreScreenData.eloUpdates.casualGame ? (
            <tr>
              <td>No changes to ladder rating</td>
            </tr>
          ) : (
            <Fragment>
              <tr>
                <td className={eloAnimatedChangeClass}>
                  Elo: {eloAnimatedChange}
                </td>
                <td className={eloAnimatedChangeClass}>
                  {`(${Math.sign(eloDiff) === 1 ? "+" : ""}
              ${eloDiff})`}
                </td>
              </tr>
              {playerOldRank !== playerNewRank ? (
                <tr>
                  <td className={""}>Rank:</td>
                  <td className={""}>
                    {playerOldRank + 1 === 0 ? "Unranked" : playerOldRank + 1}
                    {` -> `}
                    {playerNewRank + 1}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>Rank:</td>
                  <td>
                    {playerOldRank + 1}
                    {` (unchanged)`}
                  </td>
                </tr>
              )}
            </Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreScreenModalContents;
