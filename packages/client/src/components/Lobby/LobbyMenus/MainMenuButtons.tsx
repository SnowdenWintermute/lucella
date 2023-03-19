import { Socket } from "socket.io-client";
import React from "react";
import { ErrorMessages, SocketEventsFromClient } from "../../../../../common";
import GameLobbyTopButton from "./LobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setMatchmakingLoading, setActiveMenu, LobbyMenu } from "../../../redux/slices/lobby-ui-slice";
import { setShowChangeChatChannelModal, setShowMobileLobbyMenuModal } from "../../../redux/slices/ui-slice";
import CircularProgress from "../../common-components/CircularProgress";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";
import { setAlert } from "../../../redux/slices/alerts-slice";
import { Alert } from "../../../classes/Alert";
import { AlertType } from "../../../enums";

interface Props {
  socket: Socket;
}

function MainMenuButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const uiState = useAppSelector((state) => state.UI);
  const { data: user, isLoading, isFetching, isError } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });

  const handleChannelClick = () => {
    dispatch(setShowChangeChatChannelModal(true));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const handleViewGamesListClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
    dispatch(setActiveMenu(LobbyMenu.GAME_LIST));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const handleSetupNewGameClick = () => {
    dispatch(setActiveMenu(LobbyMenu.GAME_SETUP));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const handleRankedClick = () => {
    if (!socket) return;
    if (!user) {
      dispatch(setAlert(new Alert(ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED, AlertType.DANGER)));
      return;
    }
    socket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    dispatch(setShowMobileLobbyMenuModal(false));
    dispatch(setMatchmakingLoading(true));
  };

  return (
    <>
      <GameLobbyTopButton
        title="Channel"
        onClick={handleChannelClick}
        extraStyles=""
        ariaControls="Change Chat Channel modal"
        ariaExpanded={uiState.modals.changeChatChannel}
      />
      <GameLobbyTopButton title="Ranked" onClick={handleRankedClick} disabled={lobbyUiState.matchmakingMenu.isLoading} extraStyles="" />
      <GameLobbyTopButton title="Host" onClick={handleSetupNewGameClick} extraStyles="" />
      <GameLobbyTopButton title="Join" onClick={handleViewGamesListClick} extraStyles="" />
    </>
  );
}

export default MainMenuButtons;
