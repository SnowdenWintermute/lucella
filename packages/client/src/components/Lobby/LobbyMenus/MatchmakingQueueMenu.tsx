import React from "react";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../../../../../common";
import { LOBBY_TEXT } from "../../../consts/lobby-text";
import useNonAlertCollidingEscapePressExecutor from "../../../hooks/useNonAlertCollidingEscapePressExecutor";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { LobbyMenu, setActiveMenu } from "../../../redux/slices/lobby-ui-slice";
import LoadingSpinner from "../../common-components/LoadingSpinner";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";

function MatchmakingQueueMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const matchmakingQueueScreen = lobbyUiState.matchmakingMenu;

  const handleCancelRankedMatchmaking = () => {
    socket.emit(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE);
    dispatch(setActiveMenu(LobbyMenu.MAIN));
  };

  useNonAlertCollidingEscapePressExecutor(handleCancelRankedMatchmaking);

  const numPlayersToDisplay = matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.queueSize : "...";
  const eloDiffThresholdToDisplay = matchmakingQueueScreen.currentData.queueSize ? matchmakingQueueScreen.currentData.currentEloDiffThreshold : "...";

  return (
    <>
      <ul className="lobby-menus__top-buttons">
        {!lobbyUiState.currentGameRoom && <LobbyTopListItemWithButton title="Cancel" onClick={handleCancelRankedMatchmaking} extraStyles="" />}
        {lobbyUiState.currentGameRoom?.isRanked && <span>{LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING}</span>}
      </ul>
      <section className="lobby-menu matchmaking-queue-menu">
        <div className="lobby-menu__left matchmaking-queue-menu__left">
          <h3 className="lobby-menu__header matchmaking-queue-menu__header">Searching for ranked match...</h3>
          <div className="matchmaking-queue-menu__queue-status">
            <div className="matchmaking-queue-menu__queue-status-text">
              <p>Number of players in queue: {numPlayersToDisplay}</p>
              <p>Current Elo difference threshold: {eloDiffThresholdToDisplay}</p>
            </div>
            <div className="matchmaking-queue-menu__loading-spinner-container">
              {/* <CircularProgress percentage={75} thickness={12} rotateAnimation /> */}
              <LoadingSpinner extraStyles="matchmaking-queue-menu__loading-spinner" />
            </div>
          </div>
        </div>
        <div className="lobby-menu__right matchmaking-queue-menu__right">
          <h3 className="lobby-menu__header matchmaking-queue-menu__header">How the queue works</h3>
          <ul className="matchmaking-queue-menu__queue-rules">
            <li>The closest Elo players with a difference in score lower than the current threshold will be matched first</li>
            <li>The elo difference threshold will increase exponentially until a match is found</li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default MatchmakingQueueMenu;
