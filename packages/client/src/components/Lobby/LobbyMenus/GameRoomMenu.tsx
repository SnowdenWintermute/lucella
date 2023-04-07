import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { GameStatus, PlayerRole, SocketEventsFromClient, SocketMetadata } from "../../../../../common";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";
import { LobbyMenu, setActiveMenu, setPlayerReadyLoading } from "../../../redux/slices/lobby-ui-slice";
import useNonAlertCollidingEscapePressExecutor from "../../../hooks/useNonAlertCollidingEscapePressExecutor";
import { LOBBY_TEXT } from "../../../consts/lobby-text";
import { BUTTON_NAMES } from "../../../consts/button-names";
import { ARIA_LABELS } from "../../../consts/aria-labels";

function PlayerWithReadyStatus({ player, playerReady, playerRole }: { player: SocketMetadata | null; playerReady: boolean; playerRole: PlayerRole }) {
  return (
    <div className="game-room-menu__player-with-ready-status">
      <span className="game-room-menu__player" aria-label={ARIA_LABELS.GAME_ROOM.PLAYER_NAME(playerRole)}>
        {player ? player.associatedUser.username : "..."}
      </span>
      {player && (
        <span aria-label={ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(playerRole)}>
          {playerReady ? LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY : LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.NOT_READY}
        </span>
      )}
      {!player && <span aria-label={ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(playerRole)} />}
    </div>
  );
}

function GameRoomMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const [readableGameStatus, setReadableGameStatus] = useState(LOBBY_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_OPPONENT);
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const currentGameRoom = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom;

  const currentWaitingListPosition = lobbyUiState.gameCreationWaitingList.currentPosition;

  const handleLeaveGameClick = () => {
    dispatch(setActiveMenu(LobbyMenu.MAIN));
    socket.emit(SocketEventsFromClient.LEAVES_GAME);
  };

  useNonAlertCollidingEscapePressExecutor(handleLeaveGameClick);

  const handleReadyClick = () => {
    socket.emit(SocketEventsFromClient.CLICKS_READY);
    dispatch(setPlayerReadyLoading(true));
  };

  useEffect(() => {
    let newReadableGameStatus = "";
    if (!currentGameRoom) dispatch(setActiveMenu(LobbyMenu.MAIN));
    if (!currentGameRoom) return;
    const { players, playersReady, gameStatus } = currentGameRoom;
    if (!players.challenger) newReadableGameStatus = LOBBY_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_OPPONENT;
    else if (players.challenger && (!playersReady.challenger || !playersReady.host))
      newReadableGameStatus = LOBBY_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_PLAYERS_TO_BE_READY;
    else if (gameStatus === GameStatus.COUNTING_DOWN) newReadableGameStatus = LOBBY_TEXT.GAME_ROOM.GAME_STATUS.GAME_STARTING;
    else if (gameStatus === GameStatus.IN_WAITING_LIST) newReadableGameStatus = LOBBY_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST;
    setReadableGameStatus(newReadableGameStatus);
  }, [currentGameRoom]);

  if (!currentGameRoom) return <p>Error - no game room found</p>;
  const { players, playersReady, gameStatus, countdown } = currentGameRoom;
  return (
    <>
      <ul className="lobby-menus__top-buttons">
        <LobbyTopListItemWithButton title={BUTTON_NAMES.GAME_ROOM.LEAVE_GAME} onClick={handleLeaveGameClick} extraStyles="" />
      </ul>
      <section className="lobby-menu game-room-menu">
        <div className="lobby-menu__left game-room-menu__left">
          <h3 className="lobby-menu__header">
            {LOBBY_TEXT.GAME_ROOM.GAME_NAME_HEADER}
            {currentGameRoom.gameName}
          </h3>
          <div className="game-room-menu__players">
            <PlayerWithReadyStatus player={players.host} playerReady={playersReady.host} playerRole={PlayerRole.HOST} />
            <span className="game-room-menu__vs">vs.</span>
            <PlayerWithReadyStatus player={players.challenger} playerReady={playersReady.challenger} playerRole={PlayerRole.CHALLENGER} />
          </div>
          {!currentGameRoom?.isRanked && (
            <button
              type="button"
              className="button button--accent game-room-menu__ready-button"
              onClick={handleReadyClick}
              disabled={lobbyUiState.playerReadyLoading}
            >
              {BUTTON_NAMES.GAME_ROOM.READY}
            </button>
          )}
          {currentGameRoom?.isRanked && <div className="button" style={{ opacity: "0%" }} aria-hidden />}
        </div>
        <div className="lobby-menu__right game-room-menu__right">
          <p className="game-room-menu__right-main-text" aria-label={ARIA_LABELS.GAME_ROOM.GAME_STATUS}>
            {readableGameStatus}
            {gameStatus === GameStatus.COUNTING_DOWN && <span aria-label={ARIA_LABELS.GAME_ROOM.GAME_START_COUNTDOWN}>{countdown?.current}</span>}
            {gameStatus === GameStatus.IN_WAITING_LIST && <span aria-label={ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION}>{currentWaitingListPosition}</span>}
          </p>
          {gameStatus === GameStatus.IN_WAITING_LIST && (
            <p className="game-room-menu__right-info-text">The server is experiencing high load. Your game has been placed in the waiting list.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default GameRoomMenu;
