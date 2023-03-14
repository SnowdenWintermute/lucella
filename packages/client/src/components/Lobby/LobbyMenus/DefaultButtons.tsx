import { Socket } from "socket.io-client";
import React from "react";
import { SocketEventsFromClient } from "../../../../../common";
import GameLobbyTopButton from "./LobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setMatchmakingLoading, setGameRoomDisplayVisible, setViewingGamesList } from "../../../redux/slices/lobby-ui-slice";
import { setShowChangeChatChannelModal, setShowMobileLobbyMenuModal } from "../../../redux/slices/ui-slice";
import CircularProgress from "../../common-components/CircularProgress";

interface Props {
  socket: Socket;
}

function DefaultButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const uiState = useAppSelector((state) => state.UI);

  const handleChannelClick = () => {
    dispatch(setShowChangeChatChannelModal(true));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const handleViewGamesListClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
    dispatch(setViewingGamesList(true));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const handleSetupNewGameClick = () => {
    dispatch(setGameRoomDisplayVisible(true));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const handleRankedClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    dispatch(setShowMobileLobbyMenuModal(false));
    dispatch(setMatchmakingLoading(true));
  };

  return (
    <>
      <GameLobbyTopButton
        title="Channel"
        onClick={handleChannelClick}
        displayClass=""
        ariaControls="Change Chat Channel modal"
        ariaExpanded={uiState.modals.changeChatChannel}
      />
      <GameLobbyTopButton title="Ranked" onClick={handleRankedClick} disabled={lobbyUiState.matchmakingScreen.isLoading} displayClass="" />
      <GameLobbyTopButton title="Host" onClick={handleSetupNewGameClick} displayClass="" />
      <GameLobbyTopButton title="Join" onClick={handleViewGamesListClick} displayClass="" />
    </>
  );
}

export default DefaultButtons;
