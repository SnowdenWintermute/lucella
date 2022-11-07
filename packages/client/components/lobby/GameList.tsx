import { GameStatus, SocketEventsFromClient } from "@lucella/common";
import React from "react";
import { Socket } from "socket.io-client";
import { AlertType } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux";
import { Alert } from "../../classes/Alert";
import { setAlert } from "../../redux/slices/alerts-slice";

interface Props {
  socket: Socket;
}

const GameList = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameList = lobbyUiState.gameList.games;
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const gameListDisplayClass = gameListIsOpen ? "" : "height-0-hidden";

  const handleJoinGameClick = (gameName: string) => {
    if (gameName) socket.emit(SocketEventsFromClient.JOINS_GAME, gameName);
    else dispatch(setAlert(new Alert("No game by that name exists", AlertType.DANGER)));
  };

  const gamesToDisplay = [];
  if (gameList) {
    for (const game in gameList) {
      const { gameName } = gameList[game];
      const { host, challenger } = gameList[game].players;
      gamesToDisplay.push(
        <tr className="game-list-item" key={gameList[game].gameName}>
          <td>{gameName}</td>
          <td>Host: {host?.associatedUser.username}</td>
          <td>Challenger: {challenger ? challenger.associatedUser.username : "Awaiting Opponent"}</td>
          <td>
            {gameList[game].gameStatus === GameStatus.IN_LOBBY && (
              <button className="button button-standard-size button-primary" onClick={() => handleJoinGameClick(gameName)}>
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