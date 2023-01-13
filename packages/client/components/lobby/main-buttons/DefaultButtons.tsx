import { Socket } from "socket.io-client";
import React, { useState, useEffect, Fragment } from "react";
import Modal from "../../common-components/modal/Modal";
import { SocketEventsFromClient } from "../../../../common";
import GameLobbyTopButton from "../../common-components/buttons/GameLobbyTopButton";
import GameLobbyModalButton from "../../common-components/buttons/GameLobbyModalButton";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setPreGameScreenDisplayed, setViewingGamesList } from "../../../redux/slices/lobby-ui-slice";
import { mobileViewWidthThreshold } from "../../../consts";
import { setShowChangeChatChannelModal, setShowMobileLobbyMenuModal } from "../../../redux/slices/ui-slice";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

interface Props {
  socket: Socket;
}

function DefaultButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const windowDimensions = useWindowDimensions();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const uiState = useAppSelector((state) => state.UI);
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const matchmakingScreenIsOpen = lobbyUiState.matchmakingScreen.isOpen;
  const preGameScreenIsOpen = lobbyUiState.preGameScreen.isOpen;
  const [chatButtonsDisplayClass, setChatButtonsDisplayClass] = useState("");
  const [chatButtonDisplayClass, setChatButtonDisplayClass] = useState("");
  const [mobileViewActive, setMobileViewActive] = useState(false);

  // manage button visibility
  useEffect(() => {
    if (gameListIsOpen || preGameScreenIsOpen || matchmakingScreenIsOpen) {
      setChatButtonDisplayClass("chat-button-hidden");
      setChatButtonsDisplayClass("chat-buttons-hidden");
    }
    if (!gameListIsOpen && !preGameScreenIsOpen && !matchmakingScreenIsOpen) {
      setChatButtonDisplayClass("");
      setChatButtonsDisplayClass("");
    }
  }, [gameListIsOpen, preGameScreenIsOpen, matchmakingScreenIsOpen]);

  const onChannelClick = () => {
    dispatch(setShowChangeChatChannelModal(true));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const onViewGamesListClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
    dispatch(setViewingGamesList(true));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const onSetupNewGameClick = () => {
    dispatch(setPreGameScreenDisplayed(true));
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  const onRankedClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    dispatch(setShowMobileLobbyMenuModal(false));
  };

  // for mobile view
  const onMenuClick = () => {
    dispatch(setShowMobileLobbyMenuModal(true));
  };

  useEffect(() => {
    if (!windowDimensions) return;
    if (windowDimensions.width < mobileViewWidthThreshold) setMobileViewActive(true);
    else setMobileViewActive(false);
  }, [windowDimensions, setMobileViewActive]);

  const buttons = [
    { title: "Channel", onClick: onChannelClick },
    { title: "Ranked", onClick: onRankedClick },
    { title: "Host", onClick: onSetupNewGameClick },
    { title: "Join", onClick: onViewGamesListClick },
  ];

  return !mobileViewActive ? (
    <ul className={`chat-buttons-list ${chatButtonsDisplayClass}`}>
      {buttons.map((button) => (
        <li key={button.title}>
          <GameLobbyTopButton title={button.title} onClick={button.onClick} displayClass={chatButtonDisplayClass} />
        </li>
      ))}
    </ul>
  ) : (
    <>
      <GameLobbyTopButton title="≡" onClick={onMenuClick} displayClass={chatButtonDisplayClass} />
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={uiState.modals.mobileLobbyMenuModal}
        setParentDisplay={setShowMobileLobbyMenuModal}
        title="Menu"
      >
        <ul className="chat-buttons-modal-list">
          {buttons.map((button) => (
            <li key={button.title}>
              <GameLobbyModalButton title={button.title} onClick={button.onClick} />
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}

export default DefaultButtons;
