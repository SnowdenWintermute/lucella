import React from "react";
import PropTypes from "prop-types";

const GameList = ({ gameList, gameListDisplayClass }) => {
  const gamesToDisplay = [];
  if (gameList) {
    for (const game in gameList) {
      const { gameName } = gameList[game];
      const { host, challenger } = gameList[game].players;
      gamesToDisplay.push(
        <tr className="game-list-item" key={gameList[game].gameName}>
          <td>{gameName}</td>
          <td>Host: {host.username}</td>
          <td>
            Challenger: {challenger ? challenger.username : "Awaiting Opponent"}
          </td>
          <td>
            {gameList[game].gameStatus === "inLobby" && (
              <button className="button button-primary">Join</button>
            )}
          </td>
          <td>
            <button className="button button-basic">Watch</button>
          </td>
        </tr>,
      );
    }
  }
  return (
    <div className={`game-list-frame ${gameListDisplayClass}`}>
      <div className="p-10">
        <h3>Current Games</h3>
        <table className="game-list-table">
          <tbody>{gamesToDisplay}</tbody>
        </table>
      </div>
    </div>
  );
};

GameList.propTypes = { currentGames: PropTypes.object };

export default GameList;
