import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { usersApi } from "../../redux/api-slices/users-api-slice";

function ScoreScreenModalContents() {
  const user = usersApi.endpoints.getMe.useQueryState(null, { selectFromResult: ({ data }) => data! });
  const [eloAnimatedChange, setEloAnimatedChange] = useState<number | null>();
  const scoreScreenData = useAppSelector((state) => state.lobbyUi.scoreScreenData);

  let playerPreGameElo: number | undefined;
  let playerPostGameElo: number | undefined;
  let eloDiff: number | undefined;

  if (scoreScreenData && scoreScreenData.gameRoom && scoreScreenData.gameRecord) {
    playerPreGameElo =
      scoreScreenData.gameRoom!.players!.challenger!.associatedUser.username === user?.name
        ? scoreScreenData.gameRecord.secondPlayerPreGameElo
        : scoreScreenData.gameRecord.firstPlayerPreGameElo;
    playerPostGameElo =
      scoreScreenData!.gameRoom!.players!.challenger!.associatedUser.username === user?.name
        ? scoreScreenData.gameRecord.secondPlayerPostGameElo
        : scoreScreenData.gameRecord.firstPlayerPostGameElo;

    eloDiff = playerPostGameElo - playerPreGameElo;
  }

  useEffect(() => {
    const animateEloChangeTimeout = setTimeout(() => {
      setEloAnimatedChange(playerPostGameElo);
    }, 1500);
    return () => {
      clearTimeout(animateEloChangeTimeout);
    };
  }, [eloDiff, playerPostGameElo]);

  if (!scoreScreenData) return <div>Error - no score screen data received</div>;
  return (
    <div data-cy="score-screen-modal">
      <h3>Game {scoreScreenData!.gameRoom.gameName} final score:</h3>
      <table style={{ width: "200px" }}>
        <tbody>
          <tr>
            <td>{scoreScreenData.gameRoom.players.host!.associatedUser.username}:</td>
            <td>{scoreScreenData.gameRecord?.firstPlayerScore}</td>
          </tr>
          <tr>
            <td>{scoreScreenData.gameRoom.players.challenger!.associatedUser.username}:</td>
            <td>{scoreScreenData.gameRecord?.secondPlayerScore}</td>
          </tr>
          {!scoreScreenData.gameRecord?.firstPlayerPreGameElo ? (
            <tr>
              <td>No changes to ladder rating</td>
            </tr>
          ) : (
            <>
              <tr>
                <td className={eloDiff && Math.sign(eloDiff) === 1 ? "elo-animate-win" : "elo-animate-loss"}>Elo: {eloAnimatedChange}</td>
                <td className={eloDiff && Math.sign(eloDiff) === 1 ? "elo-animate-win" : "elo-animate-loss"}>
                  {eloDiff &&
                    `(${Math.sign(eloDiff) === 1 ? "+" : ""}
              ${eloDiff})`}
                </td>
              </tr>
              {/* {playerOldRank !== playerNewRank ? (
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
              )} */}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreScreenModalContents;
