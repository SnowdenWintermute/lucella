import React from "react";
import { Socket } from "socket.io-client";
import { GameRoom, GameStatus, SocketEventsFromClient } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import RefreshSvg from "../../img/menuIcons/refresh.svg";
import styles from "./game-lobby.module.scss";
import { setGameListFetching } from "../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

function GameList({ socket }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameList = lobbyUiState.gameList.games;
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const gameListDisplayClass = gameListIsOpen ? "" : "height-0-hidden";

  const handleJoinGameClick = (gameName: string) => {
    if (gameName) socket.emit(SocketEventsFromClient.JOINS_GAME, gameName);
  };

  function handleRefreshGamesListClick() {
    dispatch(setGameListFetching(true));
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
  }

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

  let elementToDispay = (
    <p data-cy="list-of-current-games" style={{ margin: "0px" }}>
      No games are currently being hosted
    </p>
  );
  if (gamesToDisplay.length)
    elementToDispay = (
      <table className="game-list-table" data-cy="list-of-current-games">
        <tbody>{gamesToDisplay}</tbody>
      </table>
    );

  return (
    <div className={`game-list-frame ${gameListDisplayClass}`}>
      <div className={styles["current-games-with-refresh-button"]}>
        <h3>Current Games</h3>
        <button
          type="button"
          data-cy="refresh-button"
          className={`${styles["refresh-button"]}`}
          disabled={lobbyUiState.gameList.isFetching}
          onClick={handleRefreshGamesListClick}
        >
          <RefreshSvg className={`${styles["refresh-icon"]}`} />
        </button>
      </div>
      <div className={styles["game-list-table-holder"]}>
        {elementToDispay}
        {/* <tbody>{[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => gameListTableRow(new GameRoom("ay")))}</tbody> */}
      </div>
    </div>
  );
}

export default GameList;
