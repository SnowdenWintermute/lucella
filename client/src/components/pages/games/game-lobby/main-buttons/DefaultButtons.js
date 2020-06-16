import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as gameUiActions from "../../../../../store/actions/game-ui";

const DefaultButtons = ({ showChangeChannelModal }) => {
  const dispatch = useDispatch();
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const gameSetupScreenIsOpen = useSelector(
    (state) => state.gameUi.gameSetupScreen.isOpen
  );
  const [chatButtonsDisplayClass, setChatButtonsDisplayClass] = useState("");
  const [chatButtonDisplayClass, setChatButtonDisplayClass] = useState("");

  // manage button visibility
  useEffect(() => {
    if (gameListIsOpen || gameSetupScreenIsOpen) {
      setChatButtonDisplayClass("chat-button-hidden");
      setChatButtonsDisplayClass("chat-buttons-hidden");
    }
    if (!gameListIsOpen && !gameSetupScreenIsOpen) {
      setChatButtonDisplayClass("");
      setChatButtonsDisplayClass("");
    }
  }, [gameListIsOpen, gameSetupScreenIsOpen]);

  // change chat channel
  const onChannelClick = () => {
    showChangeChannelModal();
  };

  // view list of games
  const onViewGamesListClick = () => {
    dispatch(gameUiActions.viewGamesListClicked());
  };

  // pre-game host screen
  const handleSetupNewGame = () => {
    dispatch(gameUiActions.setupNewGameClicked());
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
          onClick={handleSetupNewGame}
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
