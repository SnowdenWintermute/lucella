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
  const [goBackButtonDisplayClass, setGoBackButtonDisplayClass] = useState(
    "chat-button-hidden"
  );
  const [
    leaveGameButtonDisplayClass,
    setLeaveGameButtonDisplayClass,
  ] = useState("chat-button-hidden");
  const currentGame = useSelector((state) => state.gameUi.currentGame);
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const preGameScreenIsOpen = useSelector(
    (state) => state.gameUi.preGameScreen.isOpen
  );

  // button visibility
  useEffect(() => {
    if (gameListIsOpen) setGoBackButtonDisplayClass("");
    if (!gameListIsOpen) setGoBackButtonDisplayClass("chat-button-hidden");
    if (preGameScreenIsOpen) setCancelGameSetupButtonDisplayClass("");
    if (!preGameScreenIsOpen)
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    if (currentGame) {
      setLeaveGameButtonDisplayClass("");
      setGoBackButtonDisplayClass("chat-button-hidden");
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    }
    if (!currentGame) setLeaveGameButtonDisplayClass("chat-button-hidden");
  }, [gameListIsOpen, preGameScreenIsOpen, currentGame]);

  // go back from list
  const onViewGamesListBackClick = () => {
    dispatch(gameUiActions.cancelViewGamesList());
    // request update of rooms list (this is needed to see rooms that were created before this socket joined)
    socket.emit("clientRequestsUpdateOfGameRoomList");
  };

  // cancel game setup
  const onCancelGameSetupClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
    console.log("client cancelled setup of " + currentGame);
  };

  // leave current game
  const onLeaveGameClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
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
          className={`button button-basic game-lobby-top-buttons__button ${goBackButtonDisplayClass}`}
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
