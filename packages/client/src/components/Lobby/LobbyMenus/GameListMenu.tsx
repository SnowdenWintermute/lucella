/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from "react";
import { Socket } from "socket.io-client";
import { GameRoom, SocketEventsFromClient } from "../../../../../common";
import useElementIsOverflowing from "../../../hooks/useElementIsOverflowing";
import LobbyTopButton from "./LobbyTopButton";
import { LobbyMenu, setActiveMenu, setGameListFetching } from "../../../redux/slices/lobby-ui-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import RefreshSvg from "../../../img/menuIcons/refresh.svg";
import lobbyMenusStyles from "./lobby-menus.module.scss";
import styles from "./game-list-menu.module.scss";
import useScrollbarSize from "../../../hooks/useScrollbarSize";

function GameListGame({ socket, gameRoom }: { socket: Socket; gameRoom: GameRoom }) {
  const handleJoinGameClick = (gameName: string) => {
    if (gameName) socket.emit(SocketEventsFromClient.JOINS_GAME, gameName);
  };
  const gameIsFull = !!gameRoom.players.challenger;
  return (
    <div className={styles["game-list-dropdown__game-row"]}>
      <span className={styles["game-list-dropdown__game-name"]}>{gameRoom.gameName}</span>
      <span className={styles["game-list-dropdown__number-of-players"]}>{gameRoom.players.challenger ? "2" : "1"}/2</span>
      <button
        type="button"
        className={`button ${!gameIsFull && "button--accent"} ${styles["game-list-dropdown__button"]}`}
        onClick={() => handleJoinGameClick(gameRoom.gameName)}
        disabled={gameIsFull}
      >
        {gameIsFull ? "Full" : "Join"}
      </button>
    </div>
  );
}

function GameListMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameListRef = useRef<HTMLDivElement>(null);
  const gameListIsOverflowing = useElementIsOverflowing(gameListRef.current);
  const scrollbarSize = useScrollbarSize();

  console.log("scrollbarSize: ", scrollbarSize);

  function handleRefreshGamesListClick() {
    dispatch(setGameListFetching(true));
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
  }

  const noGames = !Object.values(lobbyUiState.gameList.games).length;

  return (
    <>
      <ul className={lobbyMenusStyles["lobby-menus__top-buttons"]}>
        <LobbyTopButton title="Cancel" onClick={() => dispatch(setActiveMenu(LobbyMenu.MAIN))} extraStyles="" />
        <button
          type="button"
          className={`button ${styles["game-list-buttons__refresh"]}`}
          onClick={handleRefreshGamesListClick}
          disabled={lobbyUiState.gameList.isFetching}
          data-cy="refresh-button"
          aria-label="refresh game list"
        >
          <RefreshSvg className={styles["game-list-buttons__refresh-icon"]} />
        </button>
      </ul>
      <section
        className={`${lobbyMenusStyles["lobby-menu"]} ${styles["game-list-dropdown"]} ${
          gameListIsOverflowing && styles["game-list-dropdown--scrollbar-present"]
        }`}
      >
        <div className={`${styles["game-list-dropdown__headers"]}`}>
          <h3 className={`${styles["game-list-dropdown__game-name"]} ${styles["game-list-dropdown__game-name-header"]}`}>Current games</h3>
          {!noGames && (
            <h3 className={`${styles["game-list-dropdown__number-of-players"]} ${styles["game-list-dropdown__number-of-players-header"]}`}>Players</h3>
          )}
          <span
            aria-hidden
            className={`button ${styles["game-list-dropdown__empty-header-spacer"]} ${
              gameListIsOverflowing && scrollbarSize.width && styles["game-list-dropdown__empty-header-spacer--scrollbar-present"]
            }`}
            style={{ marginLeft: gameListIsOverflowing && scrollbarSize.width ? scrollbarSize.width : 0 }}
          />
        </div>
        <div
          className={`${styles["game-list-dropdown__games"]} ${
            gameListIsOverflowing && scrollbarSize.width && styles["game-list-dropdown__games--scrollbar-padding"]
          }`}
          ref={gameListRef}
        >
          {noGames && <p>No games found</p>}
          {Object.values(lobbyUiState.gameList.games).map((gameRoom) => (
            <GameListGame socket={socket} gameRoom={gameRoom} />
          ))}
          {/* {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => (
            <GameListGame socket={socket} gameRoom={new GameRoom("ay", undefined)} />
          ))} */}
        </div>
      </section>
    </>
  );
}

export default GameListMenu;
