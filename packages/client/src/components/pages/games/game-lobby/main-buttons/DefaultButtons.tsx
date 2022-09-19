import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as gameUiActions from "../../../../../store/actions/game-ui";
import Modal from "../../../../common/modal/Modal";
import { Socket } from "socket.io-client";
import { RootState } from "../../../../../store";
import { GameUIState } from "../../../../../store/reducers/game-ui";
import GameLobbyTopButton from "./GameLobbyTopButton";
import GameLobbyModalButton from "./GameLobbyModalButton";

interface Props {
  showChangeChannelModal: () => void;
  socket: Socket;
}

const DefaultButtons = ({ showChangeChannelModal, socket }: Props) => {
  const dispatch = useDispatch();
  const gameUiState: GameUIState = useSelector((state: RootState) => state.gameUi);
  const gameListIsOpen = gameUiState.gameList.isOpen;
  const matchmakingScreenIsOpen = gameUiState.matchmakingScreen.isOpen;
  const preGameScreenIsOpen = gameUiState.preGameScreen.isOpen;
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
    socket.emit("clientRequestsUpdateOfGameRoomList");
    dispatch(gameUiActions.viewGamesListClicked());
    setMenuModalDisplayed(false);
  };

  const onSetupNewGameClick = () => {
    dispatch(gameUiActions.openPreGameScreen());
    setMenuModalDisplayed(false);
  };

  const onRankedClick = () => {
    if (!socket) return;
    socket.emit("clientStartsSeekingRankedGame");
    setMenuModalDisplayed(false);
  };

  // for mobile view
  const onMenuClick = () => {
    setMenuModalDisplayed(true);
  };

  useEffect(() => {
    if (window.innerWidth < 786) setMobileViewActive(true);
    else setMobileViewActive(false);
  }, [setMobileViewActive]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 786) setMobileViewActive(true);
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
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={menuModalDisplayed}
        setParentDisplay={setMenuModalDisplayed}
        title={"Menu"}
      >
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
