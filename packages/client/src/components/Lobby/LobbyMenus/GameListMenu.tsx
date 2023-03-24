/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from "react";
import { Socket } from "socket.io-client";
import { GameRoom, SocketEventsFromClient } from "../../../../../common";
import useElementIsOverflowing from "../../../hooks/useElementIsOverflowing";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";
import { LobbyMenu, setActiveMenu, setCurrentGameRoomLoading, setGameListFetching } from "../../../redux/slices/lobby-ui-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import RefreshSvg from "../../../img/menu-icons/refresh.svg";
import useScrollbarSize from "../../../hooks/useScrollbarSize";
import useNonAlertCollidingEscapePressExecutor from "../../../hooks/useNonAlertCollidingEscapePressExecutor";
import LoadingSpinner from "../../common-components/LoadingSpinner";

function GameListGame({ socket, gameRoom }: { socket: Socket; gameRoom: GameRoom }) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const handleJoinGameClick = (gameName: string) => {
    if (gameName) socket.emit(SocketEventsFromClient.JOINS_GAME, gameName);
    dispatch(setCurrentGameRoomLoading(gameName));
  };

  const gameIsFull = !!gameRoom.players.challenger;
  let buttonStyle = gameIsFull ? "game-list-menu__button--disabled-no-opacity" : "button--accent";
  if (!gameIsFull && lobbyUiState.currentGameRoomLoading === gameRoom.gameName) buttonStyle = "button--accent";
  else if (!gameIsFull && !!lobbyUiState.currentGameRoomLoading) buttonStyle = "button--accent game-list-menu__button--disabled-no-opacity";

  return (
    <div className="game-list-menu__game-row">
      <span className="game-list-menu__game-name">{gameRoom.gameName}</span>
      <span className="game-list-menu__number-of-players">{gameRoom.players.challenger ? "2" : "1"}/2</span>
      <button
        type="button"
        className={`button game-list-menu__button ${buttonStyle}`}
        onClick={() => handleJoinGameClick(gameRoom.gameName)}
        disabled={gameIsFull || !!lobbyUiState.currentGameRoomLoading}
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

  function handleRefreshGamesListClick() {
    dispatch(setGameListFetching(true));
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
  }

  useNonAlertCollidingEscapePressExecutor(() => dispatch(setActiveMenu(LobbyMenu.MAIN)));

  const noGames = !Object.values(lobbyUiState.gameList.games).length;

  const gameListLoadingSpinner = <LoadingSpinner key="loading spinner" extraStyles="game-list-menu__loading-spinner" />;
  let gamesToDisplay = [gameListLoadingSpinner];
  if (lobbyUiState.gameList.isFetching) gamesToDisplay = [gameListLoadingSpinner];
  else if (noGames) gamesToDisplay = [<p key="no games found">No games found</p>];
  else
    gamesToDisplay = Object.values(lobbyUiState.gameList.games).map((gameRoom) => <GameListGame key={gameRoom.gameName} socket={socket} gameRoom={gameRoom} />);

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
        </div>
        <div
          className={`${"game-list-menu__games"} ${gameListIsOverflowing && scrollbarSize.width && "game-list-menu__games--scrollbar-padding"}`}
          ref={gameListRef}
        >
          {gamesToDisplay}
          {/* {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((item, i) => (
            <GameListGame key={i + 99} socket={socket} gameRoom={new GameRoom("ay", undefined)} />
          ))} */}
        </div>
      </section>
    </>
  );
}

export default GameListMenu;
