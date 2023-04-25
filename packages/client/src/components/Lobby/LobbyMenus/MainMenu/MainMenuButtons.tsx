import { Socket } from "socket.io-client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useGetMeQuery } from "../../../../redux/api-slices/users-api-slice";
import { ERROR_MESSAGES, SocketEventsFromClient } from "../../../../../../common";
import { LobbyMenu, setActiveMenu, setGameListFetching, setMatchmakingLoading } from "../../../../redux/slices/lobby-ui-slice";
import { setAlert } from "../../../../redux/slices/alerts-slice";
import { Alert } from "../../../../classes/Alert";
import { AlertType } from "../../../../enums";
import LobbyTopListItemWithButton from "../LobbyTopListItemWithButton";
import { BUTTON_NAMES } from "../../../../consts/button-names";
import ChangeChatChannelModal from "../../modals/ChangeChatChannelModal";

function MainMenuButtons({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const uiState = useAppSelector((state) => state.UI);
  const { data: user, refetch } = useGetMeQuery(null);
  const [showChangeChatChannelModal, setShowChangeChatChannelModal] = useState(false);

  const handleViewGamesListClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
    dispatch(setGameListFetching(true));
    dispatch(setActiveMenu(LobbyMenu.GAME_LIST));
  };

  const handleSetupNewGameClick = () => {
    dispatch(setActiveMenu(LobbyMenu.GAME_SETUP));
  };

  const handleRankedClick = () => {
    if (!socket) return;
    if (!user) {
      refetch();
      dispatch(setAlert(new Alert(ERROR_MESSAGES.LOBBY.LOG_IN_TO_PLAY_RANKED, AlertType.DANGER)));
      return;
    }
    socket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    dispatch(setMatchmakingLoading(true));
  };

  if (!socket.connected) return <div className="main-menu__top-buttons-loading-message">Connecting to server...</div>;

  return (
    <>
      <LobbyTopListItemWithButton
        title={BUTTON_NAMES.MAIN_MENU.CHANNEL}
        onClick={() => setShowChangeChatChannelModal(true)}
        extraStyles=""
        ariaControls="Change Chat Channel modal"
        ariaExpanded={showChangeChatChannelModal}
      >
        {showChangeChatChannelModal && <ChangeChatChannelModal socket={socket} setParentDisplay={setShowChangeChatChannelModal} />}
      </LobbyTopListItemWithButton>
      <LobbyTopListItemWithButton
        title={BUTTON_NAMES.MAIN_MENU.RANKED}
        onClick={handleRankedClick}
        disabled={lobbyUiState.matchmakingMenu.isLoading}
        extraStyles=""
      />
      <LobbyTopListItemWithButton title={BUTTON_NAMES.MAIN_MENU.HOST} onClick={handleSetupNewGameClick} extraStyles="" />
      <LobbyTopListItemWithButton title={BUTTON_NAMES.MAIN_MENU.JOIN} onClick={handleViewGamesListClick} extraStyles="" />
    </>
  );
}

export default MainMenuButtons;
