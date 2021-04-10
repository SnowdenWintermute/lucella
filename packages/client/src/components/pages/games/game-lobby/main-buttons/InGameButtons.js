import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as gameUiActions from "../../../../../store/actions/game-ui";

const InGameButtons = ({ socket }) => {
  const dispatch = useDispatch();
  const [buttonsDisplayClass, setButtonsDisplayClass] = useState("");
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
  const isRanked = useSelector((state) => state.gameUi.isRanked);
  const gameListIsOpen = useSelector((state) => state.gameUi.gameList.isOpen);
  const matchmakingScreenIsOpen = useSelector(
    (state) => state.gameUi.matchmakingScreen.isOpen
  );
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
      if (!isRanked) {
        setLeaveGameButtonDisplayClass("");
      }
      setGoBackButtonDisplayClass("chat-button-hidden");
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    }
    if (!currentGameName) setLeaveGameButtonDisplayClass("chat-button-hidden");
    if (matchmakingScreenIsOpen) setButtonsDisplayClass("chat-button-hidden");
    if (!matchmakingScreenIsOpen) setButtonsDisplayClass("");
  }, [
    gameListIsOpen,
    preGameScreenIsOpen,
    currentGameName,
    matchmakingScreenIsOpen,
    isRanked,
  ]);

  const onViewGamesListBackClick = () => {
    dispatch(gameUiActions.cancelViewGamesList());
    socket.emit("clientRequestsUpdateOfGameRoomList");
  };

  const onCancelGameSetupClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
  };

  const onLeaveGameClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
    socket.emit("clientLeavesGame", currentGameName);
  };

  return (
    <ul className={`pre-game-buttons ${buttonsDisplayClass}`}>
      <li>{isRanked && <h3>Ranked game starting...</h3>}</li>
      <li>
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${cancelGameSetupButtonDisplayClass}`}
          onClick={onCancelGameSetupClick}
        >
          Cancel
        </button>
      </li>
      <li>
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${leaveGameButtonDisplayClass}`}
          onClick={onLeaveGameClick}
        >
          Leave Game
        </button>
      </li>
      <li>
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${goBackButtonDisplayClass}`}
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
