import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { GameStatus, SocketEventsFromClient, SocketMetadata } from "../../../../../common";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";
import { LobbyMenu, setActiveMenu } from "../../../redux/slices/lobby-ui-slice";

function PlayerWithReadyStatus({ player, playerReady }: { player: SocketMetadata | null; playerReady: boolean }) {
  return (
    <div className="game-room-menu__player-with-ready-status">
      <span className="game-room-menu__player">{player ? player.associatedUser.username : "..."}</span>
      {player && <span>{playerReady ? "ready" : "not ready"}</span>}
      {!player && <span />}
    </div>
  );
}

function GameRoomMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const [readableGameStatus, setReadableGameStatus] = useState("Waiting for an opponent");
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const currentGameRoom = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom;
  if (!currentGameRoom) return <p>Error - no game room found</p>;
  const { players, playersReady, gameStatus, countdown } = currentGameRoom;
  const currentWaitingListPosition = lobbyUiState.gameCreationWaitingList.currentPosition;

  const onLeaveGameClick = () => {
    dispatch(setActiveMenu(LobbyMenu.MAIN));
    socket.emit(SocketEventsFromClient.LEAVES_GAME);
  };

  const handleReadyClick = () => {
    socket.emit(SocketEventsFromClient.CLICKS_READY);
  };

  useEffect(() => {
    let newReadableGameStatus = "";
    if (!players.challenger) newReadableGameStatus = "Waiting for an opponent";
    else if (players.challenger && (!playersReady.challenger || !playersReady.host)) newReadableGameStatus = "Waiting for all players to be ready";
    else if (gameStatus === GameStatus.COUNTING_DOWN) newReadableGameStatus = "Game starting";
    else if (gameStatus === GameStatus.IN_WAITING_LIST) newReadableGameStatus = "Position in waiting list";
    setReadableGameStatus(newReadableGameStatus);
  }, [players.challenger, playersReady, gameStatus]);

  return (
    <>
      <ul className="lobby-menus__top-buttons">
        <LobbyTopListItemWithButton title="Leave Game" onClick={onLeaveGameClick} extraStyles="" />
      </ul>
      <section className="lobby-menu game-room-menu">
        <div className="lobby-menu__left game-room-menu__left">
          <h3 className="lobby-menu__header">Game room: {currentGameRoom.gameName}</h3>
          <div className="game-room-menu__players">
            <PlayerWithReadyStatus player={players.host} playerReady={playersReady.host} />
            <span className="game-room-menu__vs">vs.</span>
            <PlayerWithReadyStatus player={players.challenger} playerReady={playersReady.challenger} />
          </div>
          {!currentGameRoom?.isRanked && (
            <button type="button" className="button button--accent game-room-menu__ready-button" onClick={handleReadyClick}>
              Ready
            </button>
          )}
          {currentGameRoom?.isRanked && <div className="button" style={{ opacity: "0%" }} aria-hidden />}
        </div>
        <div className="lobby-menu__right game-room-menu__right">
          <p className="game-room-menu__right-main-text" aria-label="game status">
            {readableGameStatus}
            {gameStatus === GameStatus.COUNTING_DOWN && <span aria-label="game start countdown">{countdown?.current}</span>}
            {gameStatus === GameStatus.IN_WAITING_LIST && <span>{currentWaitingListPosition}</span>}
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
