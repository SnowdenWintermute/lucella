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
  const currentGameName = useSelector((state) => state.gameUi.currentGameName);
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
    if (currentGameName) {
      setLeaveGameButtonDisplayClass("");
      setGoBackButtonDisplayClass("chat-button-hidden");
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    }
    if (!currentGameName) setLeaveGameButtonDisplayClass("chat-button-hidden");
  }, [gameListIsOpen, preGameScreenIsOpen, currentGameName]);

  // go back from list
  const onViewGamesListBackClick = () => {
    dispatch(gameUiActions.cancelViewGamesList());
    // request update of rooms list (this is needed to see rooms that were created before this socket joined)
    socket.emit("clientRequestsUpdateOfGameRoomList");
  };

  // cancel game setup
  const onCancelGameSetupClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
  };

  // leave current game
  const onLeaveGameClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
    console.log("client requested to leave game " + currentGameName);
    socket.emit("clientLeavesGame", currentGameName);
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