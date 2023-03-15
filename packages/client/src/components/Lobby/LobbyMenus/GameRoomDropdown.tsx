import React from "react";
import { Socket } from "socket.io-client";
import { GameStatus, SocketEventsFromClient, SocketMetadata } from "../../../../../common";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import lobbyMenusStyles from "./lobby-menus.module.scss";
import styles from "./game-room-dropdown.module.scss";

function PlayerWithReadyStatus({ player, playerReady }: { player: SocketMetadata | null; playerReady: boolean }) {
  return (
    <div className={styles["game-room-dropdown__player-with-ready-status"]}>
      <span className={styles["game-room-dropdown__player"]}>{player ? player.associatedUser.username : "..."}</span>
      {player && <span>{playerReady ? "ready" : "not ready"}</span>}
      {!player && <span />}
    </div>
  );
}

function GameRoomDropdown({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const currentGameRoom = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom;
  if (!currentGameRoom) return <p>Error - no game room found</p>;
  const { players, playersReady, gameStatus, isRanked, countdown } = currentGameRoom;
  const currentWaitingListPosition = lobbyUiState.gameCreationWaitingList.currentPosition;

  const handleReadyClick = () => {
    socket.emit(SocketEventsFromClient.CLICKS_READY);
  };

  return (
    <section className={`${lobbyMenusStyles["lobby-menu"]} ${styles["game-room-dropdown"]}`}>
      <div className={`${lobbyMenusStyles["lobby-menu__left"]} ${styles["game-room-dropdown__left"]}`}>
        <h3 className={`${lobbyMenusStyles["lobby-menu__header"]} ${styles["game-room-dropdown__header"]}`}>Game room: {currentGameRoom.gameName}</h3>
        <div className={styles["game-room-dropdown__players"]}>
          <PlayerWithReadyStatus player={players.host} playerReady={playersReady.host} />
          <span className={styles["game-room-dropdown__vs"]}>vs.</span>
          <PlayerWithReadyStatus player={players.challenger} playerReady={playersReady.challenger} />
        </div>
        <button type="button" className={`button button--accent ${styles["game-room-dropdown__ready-button"]}`} onClick={handleReadyClick}>
          Ready
        </button>
      </div>
      <div className={`${lobbyMenusStyles["lobby-menu__right"]} ${styles["game-room-dropdown__right"]}`}>
        <td aria-label="game status">{gameStatus}</td>
        <td aria-label="game start countdown">{gameStatus === GameStatus.COUNTING_DOWN && countdown?.current}</td>
      </div>
    </section>
  );
}

export default GameRoomDropdown;
