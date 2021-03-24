import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as alertActions from "../../../../store/actions/alert";
import * as gameUiActions from "../../../../store/actions/game-ui";

const GameList = ({ socket }) => {
  const dispatch = useDispatch();
  const gameList = useSelector((state) => state.gameUi.gameList.games);
  const currentGameName = useSelector((state) => state.gameUi.currentGameName);
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const gameListDisplayClass = gameListIsOpen ? "" : "height-0-hidden";

  // cancel viewing game list if in a game
  useEffect(() => {
    if (currentGameName) {
      dispatch(gameUiActions.cancelViewGamesList());
      dispatch(gameUiActions.openPreGameScreen());
    }
  }, [currentGameName, dispatch]);

  // join games
  const onJoinGameClick = (gameName) => {
    console.log("clicked to join game " + gameName);
    if (gameName) {
      socket.emit("clientJoinsGame", { gameName });
    } else {
      dispatch(alertActions.setAlert("No game by that name exists", "danger"));
    }
  };

  const gamesToDisplay = [];
  if (gameList) {
    for (const game in gameList) {
      const { gameName } = gameList[game];
      const { host, challenger } = gameList[game].players;
      gamesToDisplay.push(
        <tr className="game-list-item" key={gameList[game].gameName}>
          <td>{gameName}</td>
          <td>Host: {host?.username}</td>
          <td>
            Challenger: {challenger ? challenger.username : "Awaiting Opponent"}
          </td>
          <td>
            {gameList[game].gameStatus === "inLobby" && (
              <button
                className="button button-standard-size button-primary"
                onClick={() => onJoinGameClick(gameName)}
              >
                Join
              </button>
            )}
          </td>
          {/* <td>
            <button className="button button-standard-size button-basic">
              Watch
            </button>
          </td> */}
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
