import React from "react";
import { Socket } from "socket.io-client";
import { LOBBY_TEXT } from "../../../consts/lobby-text";
import { useAppSelector } from "../../../redux/hooks";
import CircularProgress from "../../common-components/CircularProgress";
import lobbyMenusStyles from "./lobby-menus.module.scss";
import styles from "./matchmaking-queue-menu.module.scss";

function MatchmakingQueueMenu({ socket }: { socket: Socket }) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const matchmakingQueueScreen = lobbyUiState.matchmakingScreen;

  const numPlayersToDisplay = matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.queueSize : "...";
  const eloDiffThresholdToDisplay = matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.currentEloDiffThreshold : "...";

  return (
    <>
      <ul className={lobbyMenusStyles["lobby-menus__top-buttons"]}>
        buttons
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
            <div className={styles["matchmaking-queue-dropdown__circular-progress-container"]}>
              <CircularProgress percentage={75} thickness={12} rotateAnimation />
            </div>
          </div>
        </div>
        <div className={`${lobbyMenusStyles["lobby-menu__right"]} ${styles["matchmaking-queue-dropdown__right"]}`}>right</div>
      </section>
    </>
  );
}

export default MatchmakingQueueMenu;
