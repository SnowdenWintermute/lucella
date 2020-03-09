import React from "react";
import PropTypes from "prop-types";

const GameList = ({ gameList }) => {
  const gamesToDisplay = [];
  if (gameList) {
    for (const game in gameList) {
      gamesToDisplay.push(
        <li key={gameList[game].gameName}>{gameList[game].gameName}</li>,
      );
    }
  }
  console.log(gameList);
  return (
    <div className="game-list-frame">
      gameList
      <ul className="game-list">{gamesToDisplay}</ul>
    </div>
  );
};

GameList.propTypes = { currentGames: PropTypes.object };

export default GameList;
