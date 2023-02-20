import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { usersApi } from "../../redux/api-slices/users-api-slice";
import styles from "./game-lobby.module.scss";

function ScoreScreenModalContents() {
  const user = usersApi.endpoints.getMe.useQueryState(null, { selectFromResult: ({ data }) => data! });
  const [eloAnimatedChange, setEloAnimatedChange] = useState<number | null>();
  const scoreScreenData = useAppSelector((state) => state.lobbyUi.scoreScreenData);

  let playerPreGameElo: number | undefined;
  let playerPostGameElo: number | undefined;
  let playerPreGameRank: number | undefined;
  let playerPostGameRank: number | undefined;
  let eloDiff: number | undefined;

  if (scoreScreenData && scoreScreenData.gameRoom && scoreScreenData.gameRecord) {
    if (scoreScreenData.gameRoom!.players!.challenger!.associatedUser.username === user?.name) {
      playerPreGameElo = scoreScreenData.gameRecord.secondPlayerPreGameElo;
      playerPostGameElo = scoreScreenData.gameRecord.secondPlayerPostGameElo;
      playerPreGameRank = scoreScreenData.gameRecord.secondPlayerPreGameRank;
      playerPostGameRank = scoreScreenData.gameRecord.secondPlayerPostGameRank;
    } else {
      playerPreGameElo = scoreScreenData.gameRecord.firstPlayerPreGameElo;
      playerPostGameElo = scoreScreenData.gameRecord.firstPlayerPostGameElo;
      playerPreGameRank = scoreScreenData.gameRecord.firstPlayerPreGameRank;
      playerPostGameRank = scoreScreenData.gameRecord.firstPlayerPostGameRank;
    }

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
      <h3 style={{ marginBottom: "10px" }}>Game {scoreScreenData!.gameRoom.gameName} final score:</h3>
      <table style={{ width: "200px" }}>
        <tbody>
          <tr>
            <td className={styles["score-screen-table-cell"]}>{scoreScreenData.gameRoom.players.host!.associatedUser.username}:</td>
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
                <td className={eloDiff && Math.sign(eloDiff) === 1 ? "elo-animate-win" : "elo-animate-loss"}>Elo:</td>
                <td className={eloDiff && Math.sign(eloDiff) === 1 ? "elo-animate-win" : "elo-animate-loss"}>
                  {eloAnimatedChange || playerPreGameElo}{" "}
                  {eloDiff &&
                    `(${Math.sign(eloDiff) === 1 ? "+" : ""}
              ${eloDiff})`}
                </td>
              </tr>
              {typeof playerPreGameRank === "number" && typeof playerPostGameRank === "number" && playerPostGameRank !== playerPreGameRank ? (
                <tr>
                  <td>Rank:</td>
                  <td>
                    {playerPreGameRank + 1}
                    {` -> `}
                    {playerPostGameRank + 1}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>Rank:</td>
                  <td>
                    {playerPreGameRank && playerPreGameRank + 1}
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
