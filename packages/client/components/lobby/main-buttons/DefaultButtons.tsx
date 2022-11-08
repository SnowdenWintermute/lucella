import React, { useState, useEffect, Fragment } from "react";
import Modal from "../../common-components/modal/Modal";
import { SocketEventsFromClient } from "../../../../common";
import { Socket } from "socket.io-client";
import GameLobbyTopButton from "../../common-components/buttons/GameLobbyTopButton";
import GameLobbyModalButton from "../../common-components/buttons/GameLobbyModalButton";
import { useAppSelector, useAppDispatch } from "../../../redux";
import { setPreGameScreenDisplayed, setViewingGamesList } from "../../../redux/slices/lobby-ui-slice";
import { mobileViewWidthThreshold } from "../../../consts";

interface Props {
  showChangeChannelModal: () => void;
  socket: Socket;
}

const DefaultButtons = ({ showChangeChannelModal, socket }: Props) => {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const matchmakingScreenIsOpen = lobbyUiState.matchmakingScreen.isOpen;
  const preGameScreenIsOpen = lobbyUiState.preGameScreen.isOpen;
  const [chatButtonsDisplayClass, setChatButtonsDisplayClass] = useState("");
  const [chatButtonDisplayClass, setChatButtonDisplayClass] = useState("");
  const [mobileViewActive, setMobileViewActive] = useState(false);
  const [menuModalDisplayed, setMenuModalDisplayed] = useState(false);

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
    showChangeChannelModal();
    setMenuModalDisplayed(false);
  };

  const onViewGamesListClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
    dispatch(setViewingGamesList(true));
    setMenuModalDisplayed(false);
  };

  const onSetupNewGameClick = () => {
    dispatch(setPreGameScreenDisplayed(true));
    setMenuModalDisplayed(false);
  };

  const onRankedClick = () => {
    if (!socket) return;
    socket.emit(SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE);
    setMenuModalDisplayed(false);
  };

  // for mobile view
  const onMenuClick = () => {
    setMenuModalDisplayed(true);
  };

  useEffect(() => {
    if (window.innerWidth < mobileViewWidthThreshold) setMobileViewActive(true);
    else setMobileViewActive(false);
    function handleResize() {
      if (window.innerWidth < mobileViewWidthThreshold) setMobileViewActive(true);
      else setMobileViewActive(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobileViewActive]);

  return !mobileViewActive ? (
    <ul className={`chat-buttons-list ${chatButtonsDisplayClass}`}>
      <li>
        <GameLobbyTopButton title="Channel" onClick={onChannelClick} displayClass={chatButtonDisplayClass} />
      </li>
      <li>
        <GameLobbyTopButton title="Ranked" onClick={onRankedClick} displayClass={chatButtonDisplayClass} />
      </li>
      <li>
        <GameLobbyTopButton title="Host" onClick={onSetupNewGameClick} displayClass={chatButtonDisplayClass} />
      </li>
      <li>
        <GameLobbyTopButton title="Join" onClick={onViewGamesListClick} displayClass={chatButtonDisplayClass} />
      </li>
    </ul>
  ) : (
    <Fragment>
      <GameLobbyTopButton title="≡" onClick={onMenuClick} displayClass={chatButtonDisplayClass} />
      <Modal screenClass="" frameClass="modal-frame-dark" isOpen={menuModalDisplayed} setParentDisplay={setMenuModalDisplayed} title={"Menu"}>
        <ul className={`chat-buttons-modal-list`}>
          <li>
            <GameLobbyModalButton title="Channel" onClick={onChannelClick} />
          </li>
          <li>
            <GameLobbyModalButton title="Ranked" onClick={onRankedClick} />
          </li>
          <li>
            <GameLobbyModalButton title="Host" onClick={onSetupNewGameClick} />
          </li>
          <li>
            <GameLobbyModalButton title="Join" onClick={onViewGamesListClick} />
          </li>
        </ul>
      </Modal>
    </Fragment>
  );
};

export default DefaultButtons;
