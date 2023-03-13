import React from "react";
import { Socket } from "socket.io-client";
import { LOBBY_TEXT } from "../../../consts/lobby-text";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import DefaultButtons from "./DefaultButtons";
import GameRoomTopButtons from "./GameRoomTopButtons";
import MatchmakingButtons from "./MatchmakingButtons";
import styles from "./lobby-buttons.module.scss";
import { setViewingGamesList } from "../../../redux/slices/lobby-ui-slice";
import GameLobbyTopButton from "./LobbyTopButton";

interface Props {
  socket: Socket;
}

function MainButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);

  const { currentGameRoom } = lobbyUiState;

  const viewingGameRoom = currentGameRoom || lobbyUiState.gameRoomDisplay.isOpen;
  const showDefaultButtons = !lobbyUiState.gameList.isOpen && !viewingGameRoom && !lobbyUiState.matchmakingScreen.isOpen;

  const onViewGamesListBackClick = () => {
    dispatch(setViewingGamesList(false));
  };

  return (
    <ul className={styles["lobby-buttons"]}>
      {showDefaultButtons && <DefaultButtons socket={socket} />}
      {viewingGameRoom && !currentGameRoom?.isRanked && <GameRoomTopButtons socket={socket} />}
      {lobbyUiState.matchmakingScreen.isOpen && <MatchmakingButtons socket={socket} />}
      {currentGameRoom?.isRanked && <span>{LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING}</span>}
      {lobbyUiState.gameList.isOpen && <GameLobbyTopButton title="Back" onClick={onViewGamesListBackClick} displayClass="" />}
    </ul>
  );
}

export default MainButtons;
