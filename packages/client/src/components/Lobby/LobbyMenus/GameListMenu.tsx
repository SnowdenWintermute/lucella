/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from "react";
import { Socket } from "socket.io-client";
import { GameRoom, SocketEventsFromClient } from "../../../../../common";
import useElementIsOverflowing from "../../../hooks/useElementIsOverflowing";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";
import { LobbyMenu, setActiveMenu, setGameListFetching } from "../../../redux/slices/lobby-ui-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import RefreshSvg from "../../../img/menu-icons/refresh.svg";
import useScrollbarSize from "../../../hooks/useScrollbarSize";

function GameListGame({ socket, gameRoom }: { socket: Socket; gameRoom: GameRoom }) {
  const handleJoinGameClick = (gameName: string) => {
    if (gameName) socket.emit(SocketEventsFromClient.JOINS_GAME, gameName);
  };
  const gameIsFull = !!gameRoom.players.challenger;
  return (
    <div className="game-list-menu__game-row">
      <span className="game-list-menu__game-name">{gameRoom.gameName}</span>
      <span className="game-list-menu__number-of-players">{gameRoom.players.challenger ? "2" : "1"}/2</span>
      <button
        type="button"
        className={`button ${!gameIsFull && "button--accent"} game-list-menu__button`}
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
      <ul className="lobby-menus__top-buttons">
        <LobbyTopListItemWithButton title="Cancel" onClick={() => dispatch(setActiveMenu(LobbyMenu.MAIN))} extraStyles="" />
        <button
          type="button"
          className="button game-list-buttons__refresh"
          onClick={handleRefreshGamesListClick}
          disabled={lobbyUiState.gameList.isFetching}
          data-cy="refresh-button"
          aria-label="refresh game list"
        >
          <RefreshSvg className="game-list-buttons__refresh-icon" />
        </button>
      </ul>
      <section className={`lobby-menu game-list-menu ${gameListIsOverflowing && "game-list-menu--scrollbar-present"}`}>
        <div className={`${"game-list-menu__headers"}`}>
          <h3 className={`${"game-list-menu__game-name"} ${"game-list-menu__game-name-header"}`}>Current games</h3>
          {/* {!noGames && <h3 className={`${"game-list-menu__number-of-players"} ${"game-list-menu__number-of-players-header"}`}>Players</h3>} */}
          <span
            aria-hidden
            className={`button ${"game-list-menu__empty-header-spacer"} ${
              gameListIsOverflowing && scrollbarSize.width && "game-list-menu__empty-header-spacer--scrollbar-present"
            }`}
            style={{ marginLeft: gameListIsOverflowing && scrollbarSize.width ? scrollbarSize.width : 0 }}
          />
        </div>
        <div
          className={`${"game-list-menu__games"} ${gameListIsOverflowing && scrollbarSize.width && "game-list-menu__games--scrollbar-padding"}`}
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
