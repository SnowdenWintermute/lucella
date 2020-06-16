import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as gameUiActions from "../../../../../store/actions/game-ui";

const InGameButtons = ({ socket }) => {
  const dispatch = useDispatch();
  const [
    cancelGameSetupButtonDisplayClass,
    setCancelGameSetupButtonDisplayClass,
  ] = useState("chat-button-hidden");
  const [gameListButtonDisplayClass, setGameListButtonDisplayClass] = useState(
    "chat-button-hidden"
  );
  const [
    leaveGameButtonDisplayClass,
    setLeaveGameButtonDisplayClass,
  ] = useState("chat-button-hidden");
  const currentGame = useSelector((state) => state.gameUi.currentGame);
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const gameSetupScreenIsOpen = useSelector(
    (state) => state.gameUi.gameSetupScreen.isOpen
  );

  // button visibility
  useEffect(() => {
    if (gameListIsOpen) setGameListButtonDisplayClass("");
    if (!gameListIsOpen) setGameListButtonDisplayClass("chat-button-hidden");
    if (gameSetupScreenIsOpen) setCancelGameSetupButtonDisplayClass("");
    if (!gameSetupScreenIsOpen)
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    if (currentGame) {
      setLeaveGameButtonDisplayClass("");
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    }
    if (!currentGame) setLeaveGameButtonDisplayClass("chat-button-hidden");
  }, [gameListIsOpen, gameSetupScreenIsOpen, currentGame]);

  // go back from list
  const onViewGamesListBackClick = () => {
    dispatch(gameUiActions.cancelViewGamesListClicked());
  };

  // cancel game setup
  const onCancelGameSetupClick = () => {
    dispatch(gameUiActions.cancelGameSetupClicked());
    console.log("client cancelled setup of " + currentGame);
  };

  // leave current game
  const onLeaveGameClick = () => {
    dispatch(gameUiActions.cancelGameSetupClicked());
    console.log("client requested to leave game " + currentGame.gameName);
    socket.emit("clientLeavesGame", currentGame.gameName);
  };

  return (
    <ul className={`pre-game-buttons`}>
      <li>
        <button
          className={`button button-basic game-lobby-top-buttons__button ${cancelGameSetupButtonDisplayClass}`}
          onClick={onCancelGameSetupClick}
        >
          Cancel
        </button>
      </li>
      <li>
        <button
          className={`button button-basic game-lobby-top-buttons__button ${leaveGameButtonDisplayClass}`}
          onClick={onLeaveGameClick}
        >
          Leave Game
        </button>
      </li>
      <li>
        <button
          className={`button button-basic game-lobby-top-buttons__button ${gameListButtonDisplayClass}`}
          onClick={onViewGamesListBackClick}
        >
          Back
        </button>
      </li>
    </ul>
  );
};

InGameButtons.propTypes = {
  socket: PropTypes.object,
};

export default InGameButtons;
