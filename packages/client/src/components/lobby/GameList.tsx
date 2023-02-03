import React from "react";
import { Socket } from "socket.io-client";
import { GameRoom, GameStatus, SocketEventsFromClient } from "../../../../common";
import { useAppSelector } from "../../redux/hooks";

interface Props {
  socket: Socket;
}

function GameList({ socket }: Props) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameList = lobbyUiState.gameList.games;
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const gameListDisplayClass = gameListIsOpen ? "" : "height-0-hidden";

  const handleJoinGameClick = (gameName: string) => {
    if (gameName) socket.emit(SocketEventsFromClient.JOINS_GAME, gameName);
  };

  const gameListTableRow = (gameRoom: GameRoom) => {
    const { host, challenger } = gameRoom.players;
    const { gameName } = gameRoom;
    return (
      <tr className="game-list-item" key={gameName}>
        <td>{gameName}</td>
        <td>Host: {host?.associatedUser.username}</td>
        <td>Challenger: {challenger ? challenger.associatedUser.username : "Awaiting Opponent"}</td>
        <td>
          {gameRoom.gameStatus === GameStatus.IN_LOBBY && (
            <button type="button" className="button button-standard-size button-primary" onClick={() => handleJoinGameClick(gameName)}>
              Join
            </button>
          )}
        </td>
      </tr>
    );
  };

  const gamesToDisplay: JSX.Element[] = [];

  if (gameList) {
    Object.values(gameList).forEach((gameRoom) => {
      gamesToDisplay.push(gameListTableRow(gameRoom));
    });
  }

  return (
    <div className={`game-list-frame ${gameListDisplayClass}`}>
      <div className="p-10">
        <h3>Current Games</h3>
        <table className="game-list-table" data-cy="list-of-current-games">
          <tbody>{gamesToDisplay}</tbody>
        </table>
      </div>
    </div>
  );
}

export default GameList;
