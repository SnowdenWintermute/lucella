import React from "react";
import { useSelector } from "react-redux";

const ScoreScreenModalContents = () => {
  const scoreScreenData = useSelector((state) => state.lobbyUi.scoreScreenData);
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
        </tbody>
      </table>
    </div>
  );
};

export default ScoreScreenModalContents;
