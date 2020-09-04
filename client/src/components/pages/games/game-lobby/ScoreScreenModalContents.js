import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ScoreScreenModalContents = () => {
  const [eloAnimatedChangeClass, setEloAnimatedChangeClass] = useState(
    "elo-animate-1",
  );
  const [eloAnimatedChange, setEloAnimatedChange] = useState();
  const scoreScreenData = useSelector((state) => state.lobbyUi.scoreScreenData);
  const username = useSelector((state) =>
    state.auth.user ? state.auth.user.name : null,
  );

  let playerOldElo, playerNewElo;

  if (scoreScreenData.eloUpdates) {
    playerOldElo =
      scoreScreenData.gameRoom.players.challenger.username === username
        ? scoreScreenData.eloUpdates.challengerElo
        : scoreScreenData.eloUpdates.hostElo;

    playerNewElo =
      scoreScreenData.gameRoom.players.challenger.username === username
        ? scoreScreenData.eloUpdates.newChallengerElo
        : scoreScreenData.eloUpdates.newHostElo;
  }

  const eloDiff = playerNewElo - playerOldElo;

  useEffect(() => {
    setEloAnimatedChange(playerOldElo);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const newEloAnimateClass =
        Math.sign(eloDiff) === 1 ? "elo-animate-2-win" : "elo-animate-2-loss";
      setEloAnimatedChangeClass(newEloAnimateClass);
    }, 1000);
    setTimeout(() => {
      setEloAnimatedChange(playerNewElo);
    }, 1300);
    setTimeout(() => {
      setEloAnimatedChangeClass("elo-animate-3");
    }, 3000);
  }, []);

  if (!scoreScreenData.gameData) return <div />;
  return (
    <div>
      <h3>Game {scoreScreenData.gameRoom.gameName} final score:</h3>
      <table>
        <tbody>
          <tr>
            <td>{scoreScreenData.gameRoom.players.host.username}:</td>
            <td>{scoreScreenData.gameData.score.host}</td>
          </tr>
          <tr>
            <td>{scoreScreenData.gameRoom.players.challenger.username}:</td>
            <td>{scoreScreenData.gameData.score.challenger}</td>
          </tr>
          {scoreScreenData.eloUpdates ? (
            <tr>
              <td className={eloAnimatedChangeClass}>
                Elo: {eloAnimatedChange}
              </td>
              <td className={eloAnimatedChangeClass}>
                {`(${Math.sign(eloDiff) === 1 ? "+" : ""}
              ${eloDiff})`}
              </td>
            </tr>
          ) : (
            <tr>
              <td>No changes to ladder rating</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreScreenModalContents;
