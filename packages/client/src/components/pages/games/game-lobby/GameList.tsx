import { GameStatus } from "../common/src/enums";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { AlertType } from "../../../../enums";
import { RootState } from "../../../../store";
import * as alertActions from "../../../../store/actions/alert";
import * as gameUiActions from "../../../../store/actions/game-ui";
import { GameUIState } from "../../../../store/reducers/game-ui";

interface Props {
  socket: Socket;
}

const GameList = ({ socket }: Props) => {
  const dispatch = useDispatch();
  const gameUiState: GameUIState = useSelector((state: RootState) => state.gameUi);
  const gameList = gameUiState.gameList.games;
  const gameListIsOpen = gameUiState.gameList.isOpen;
  const { currentGameName } = gameUiState;
  const gameListDisplayClass = gameListIsOpen ? "" : "height-0-hidden";

  // cancel viewing game list if in a game
  useEffect(() => {
    if (currentGameName) {
      dispatch(gameUiActions.cancelViewGamesList());
      dispatch(gameUiActions.openPreGameScreen());
    }
  }, [currentGameName, dispatch]);

  const onJoinGameClick = (gameName: string) => {
    if (gameName) {
      socket.emit("clientJoinsGame", { gameName });
    } else {
      dispatch(alertActions.setAlert("No game by that name exists", AlertType.DANGER));
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
          <td>Challenger: {challenger ? challenger.username : "Awaiting Opponent"}</td>
          <td>
            {gameList[game].gameStatus === GameStatus.IN_LOBBY && (
              <button className="button button-standard-size button-primary" onClick={() => onJoinGameClick(gameName)}>
                Join
              </button>
            )}
          </td>
        </tr>
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

export default GameList;
