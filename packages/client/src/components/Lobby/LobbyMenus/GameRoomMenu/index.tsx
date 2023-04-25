import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { BattleRoomGameConfigOptionIndices, GameStatus, SocketEventsFromClient } from "../../../../../../common";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import LobbyTopListItemWithButton from "../LobbyTopListItemWithButton";
import { LobbyMenu, setActiveMenu } from "../../../../redux/slices/lobby-ui-slice";
import useNonAlertCollidingEscapePressExecutor from "../../../../hooks/useNonAlertCollidingEscapePressExecutor";
import { APP_TEXT } from "../../../../consts/app-text";
import { BUTTON_NAMES } from "../../../../consts/button-names";
import { ARIA_LABELS } from "../../../../consts/aria-labels";
import { useGetMeQuery } from "../../../../redux/api-slices/users-api-slice";
import BattleRoomRules from "../BattleRoomRules";
import SettingsIcon from "../../../../img/menu-icons/settings-icon.svg";
import GameConfigDisplay from "./GameConfigDisplay";
import GameRoomMenuMainDisplay from "./GameRoomMenuMainDisplay";

function GameRoomMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const [readableGameStatus, setReadableGameStatus] = useState(APP_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_OPPONENT);
  const [viewingGameConfigDisplay, setViewingGameConfigDisplay] = useState(false);
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { data: user } = useGetMeQuery(null);
  const gameRoom = lobbyUiState.gameRoom && lobbyUiState.gameRoom;

  const currentWaitingListPosition = lobbyUiState.gameCreationWaitingList.currentPosition;

  const handleLeaveGameClick = () => {
    dispatch(setActiveMenu(LobbyMenu.MAIN));
    socket.emit(SocketEventsFromClient.LEAVES_GAME);
  };

  useNonAlertCollidingEscapePressExecutor(handleLeaveGameClick);

  const sendEditConfigRequest = (key: string, value: any) => {
    socket.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [key]: value });
  };

  const sendResetToDefaultsRequest = () => {
    socket.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, new BattleRoomGameConfigOptionIndices({}));
  };

  useEffect(() => {
    let newReadableGameStatus = "";
    if (!gameRoom) dispatch(setActiveMenu(LobbyMenu.MAIN));
    if (!gameRoom) return;
    const { players, playersReady, gameStatus } = gameRoom;
    if (!players.challenger) newReadableGameStatus = APP_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_OPPONENT;
    else if (players.challenger && (!playersReady.challenger || !playersReady.host))
      newReadableGameStatus = APP_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_PLAYERS_TO_BE_READY;
    else if (gameStatus === GameStatus.COUNTING_DOWN) newReadableGameStatus = APP_TEXT.GAME_ROOM.GAME_STATUS.GAME_STARTING;
    else if (gameStatus === GameStatus.IN_WAITING_LIST) newReadableGameStatus = APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST;
    setReadableGameStatus(newReadableGameStatus);
  }, [gameRoom]);

  if (!gameRoom) return <p>Error - no game room found</p>;
  const { players, gameStatus, countdown } = gameRoom;
  const bothPlayersReady = gameRoom.playersReady.host && lobbyUiState.gameRoom?.playersReady.challenger;
  const isHost = user?.name === players.host?.associatedUser.username || lobbyUiState.guestUsername === players.host?.associatedUser.username;

  let leftDisplay = <GameRoomMenuMainDisplay socket={socket} gameRoom={gameRoom} isHost={isHost} />;

  if (viewingGameConfigDisplay)
    leftDisplay = lobbyUiState.gameRoom ? (
      <GameConfigDisplay
        disabled={bothPlayersReady || !isHost}
        handleEditOption={sendEditConfigRequest}
        handleResetToDefaults={sendResetToDefaultsRequest}
        currentValues={lobbyUiState.gameRoom.battleRoomGameConfigOptionIndices}
      />
    ) : (
      <p>...</p>
    );

  return (
    <>
      <ul className="lobby-menus__top-buttons">
        {!viewingGameConfigDisplay && <LobbyTopListItemWithButton title={BUTTON_NAMES.GAME_ROOM.LEAVE_GAME} onClick={handleLeaveGameClick} extraStyles="" />}
        {viewingGameConfigDisplay && (
          <LobbyTopListItemWithButton title={BUTTON_NAMES.GENERIC_NAV.BACK} onClick={() => setViewingGameConfigDisplay(false)} extraStyles="" />
        )}
        <button
          type="button"
          title={!viewingGameConfigDisplay ? "game config" : "close config"}
          className={`button game-room-menu__settings-button ${viewingGameConfigDisplay && "button--accent"}`}
          onClick={() => setViewingGameConfigDisplay(!viewingGameConfigDisplay)}
          aria-label={ARIA_LABELS.GAME_ROOM.GAME_SETTINGS}
        >
          <SettingsIcon className="game-room-menu__settings-icon" />
        </button>
      </ul>
      <section className="lobby-menu game-room-menu">
        <div className="lobby-menu__left game-room-menu__left">
          {leftDisplay}

          {gameRoom?.isRanked && <div className="button" style={{ opacity: "0%" }} aria-hidden />}
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
          {gameStatus !== GameStatus.IN_WAITING_LIST && <BattleRoomRules />}
        </div>
      </section>
    </>
  );
}

export default GameRoomMenu;
