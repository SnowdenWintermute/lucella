import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as gameUiActions from "../../../../../store/actions/game-ui";
import Modal from "../../../../common/modal/Modal";

const DefaultButtons = ({ showChangeChannelModal, socket }) => {
  const dispatch = useDispatch();
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const matchmakingScreenIsOpen = useSelector(
    (state) => state.gameUi.matchmakingScreen.isOpen,
  );
  const preGameScreenIsOpen = useSelector(
    (state) => state.gameUi.preGameScreen.isOpen,
  );
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

  // change chat channel
  const onChannelClick = () => {
    showChangeChannelModal();
    setMenuModalDisplayed(false);
  };

  // view list of games
  const onViewGamesListClick = () => {
    if (!socket) return;
    socket.emit("clientRequestsUpdateOfGameRoomList");
    dispatch(gameUiActions.viewGamesListClicked());
    setMenuModalDisplayed(false);
  };

  // pre-game host screen
  const onSetupNewGameClick = () => {
    dispatch(gameUiActions.openPreGameScreen());
    setMenuModalDisplayed(false);
  };

  // join ranked
  const onRankedClick = () => {
    if (!socket) return;
    socket.emit("clientStartsSeekingRankedGame");
    setMenuModalDisplayed(false);
  };

  // open mobile menu
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
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          onClick={onChannelClick}
        >
          Channel
        </button>
      </li>
      <li>
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          onClick={onRankedClick}
        >
          Ranked
        </button>
      </li>
      <li>
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          onClick={onSetupNewGameClick}
        >
          Host
        </button>
      </li>
      <li>
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          onClick={onViewGamesListClick}
        >
          Join
        </button>
      </li>
    </ul>
  ) : (
    <Fragment>
      <button
        className={`button button-standard-size button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
        onClick={onMenuClick}
      >
        ≡
      </button>

      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={menuModalDisplayed}
        setParentDisplay={setMenuModalDisplayed}
        title={"Menu"}
      >
        <ul className={`chat-buttons-modal-list`}>
          <li>
            <button
              className={`button button-standard-size button-basic game-lobby-top-buttons__button game-lobby-menu-modal-button`}
              onClick={onChannelClick}
            >
              Channel
            </button>
          </li>
          <li>
            <button
              className={`button button-standard-size button-basic game-lobby-top-buttons__button game-lobby-menu-modal-button`}
              onClick={onRankedClick}
            >
              Ranked
            </button>
          </li>
          <li>
            <button
              className={`button button-standard-size button-basic game-lobby-top-buttons__button game-lobby-menu-modal-button`}
              onClick={onSetupNewGameClick}
            >
              Host
            </button>
          </li>
          <li>
            <button
              className={`button button-standard-size button-basic game-lobby-top-buttons__button game-lobby-menu-modal-button`}
              onClick={onViewGamesListClick}
            >
              Join
            </button>
          </li>
        </ul>
      </Modal>
    </Fragment>
  );
};

DefaultButtons.propTypes = {
  showChangeChannelModal: PropTypes.func.isRequired,
};

export default DefaultButtons;
