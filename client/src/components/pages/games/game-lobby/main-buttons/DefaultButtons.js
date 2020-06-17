import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as gameUiActions from "../../../../../store/actions/game-ui";

const DefaultButtons = ({ showChangeChannelModal, socket }) => {
  const dispatch = useDispatch();
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const preGameScreenIsOpen = useSelector(
    (state) => state.gameUi.preGameScreen.isOpen
  );
  const [chatButtonsDisplayClass, setChatButtonsDisplayClass] = useState("");
  const [chatButtonDisplayClass, setChatButtonDisplayClass] = useState("");

  // manage button visibility
  useEffect(() => {
    if (gameListIsOpen || preGameScreenIsOpen) {
      setChatButtonDisplayClass("chat-button-hidden");
      setChatButtonsDisplayClass("chat-buttons-hidden");
    }
    if (!gameListIsOpen && !preGameScreenIsOpen) {
      setChatButtonDisplayClass("");
      setChatButtonsDisplayClass("");
    }
  }, [gameListIsOpen, preGameScreenIsOpen]);

  // change chat channel
  const onChannelClick = () => {
    showChangeChannelModal();
  };

  // view list of games
  const onViewGamesListClick = () => {
    socket.emit("clientRequestsUpdateOfGameRoomList");
    dispatch(gameUiActions.viewGamesListClicked());
  };

  // pre-game host screen
  const onSetupNewGameClick = () => {
    dispatch(gameUiActions.openPreGameScreen());
  };

  return (
    <ul className={`chat-buttons-list ${chatButtonsDisplayClass}`}>
      <li>
        <button
          className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          onClick={onChannelClick}
        >
          Channel
        </button>
      </li>
      <li>
        <button
          className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
        >
          Ranked
        </button>
      </li>
      <li>
        <button
          className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          onClick={onSetupNewGameClick}
        >
          Host
        </button>
      </li>
      <li>
        <button
          className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          onClick={onViewGamesListClick}
        >
          Join
        </button>
      </li>
    </ul>
  );
};

DefaultButtons.propTypes = {
  showChangeChannelModal: PropTypes.func.isRequired,
};

export default DefaultButtons;
