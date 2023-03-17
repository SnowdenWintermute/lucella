import React from "react";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../../../../../common";
import { LOBBY_TEXT } from "../../../consts/lobby-text";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { LobbyMenu, setActiveMenu } from "../../../redux/slices/lobby-ui-slice";
import CircularProgress from "../../common-components/CircularProgress";
import LoadingSpinner from "../../common-components/LoadingSpinner";
import lobbyMenusStyles from "./lobby-menus.module.scss";
import LobbyTopButton from "./LobbyTopButton";
import styles from "./matchmaking-queue-menu.module.scss";

function MatchmakingQueueMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const matchmakingQueueScreen = lobbyUiState.matchmakingMenu;

  const handleCancelRankedMatchmaking = () => {
    socket.emit(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE);
    dispatch(setActiveMenu(LobbyMenu.MAIN));
  };

  const numPlayersToDisplay = matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.queueSize : "...";
  const eloDiffThresholdToDisplay = matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.currentEloDiffThreshold : "...";

  return (
    <>
      <ul className={lobbyMenusStyles["lobby-menus__top-buttons"]}>
        {!lobbyUiState.currentGameRoom && <LobbyTopButton title="Cancel" onClick={handleCancelRankedMatchmaking} extraStyles="" />}
        {lobbyUiState.currentGameRoom?.isRanked && <span>{LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING}</span>}
      </ul>
      <section className={`${lobbyMenusStyles["lobby-menu"]} ${styles["matchmaking-queue-dropdown"]}`}>
        <div className={`${lobbyMenusStyles["lobby-menu__left"]} ${styles["matchmaking-queue-dropdown__left"]}`}>
          <h3 className={`${lobbyMenusStyles["lobby-menu__header"]} ${styles["matchmaking-queue-dropdown__header"]}`}>Searching for ranked match...</h3>
          <div className={styles["matchmaking-queue-dropdown__queue-status"]}>
            <div className={styles["matchmaking-queue-dropdown__queue-status-text"]}>
              <p>Number of players in queue: {numPlayersToDisplay}</p>
              <p>Current Elo difference threshold: {eloDiffThresholdToDisplay}</p>
            </div>
            <div className={styles["matchmaking-queue-dropdown__loading-spinner-container"]}>
              {/* <CircularProgress percentage={75} thickness={12} rotateAnimation /> */}
              <LoadingSpinner extraStyles={styles["matchmaking-queue-dropdown__loading-spinner"]} />
            </div>
          </div>
        </div>
        <div className={`${lobbyMenusStyles["lobby-menu__right"]} ${styles["matchmaking-queue-dropdown__right"]}`}>
          <h3 className={`${lobbyMenusStyles["lobby-menu__header"]} ${styles["matchmaking-queue-dropdown__header"]}`}>How the queue works</h3>
          <ul className={styles["matchmaking-queue-dropdown__queue-rules"]}>
            <li>The closest Elo players with a difference in score lower than the current threshold will be matched first</li>
            <li>The elo difference threshold will increase exponentially until a match is found</li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default MatchmakingQueueMenu;
