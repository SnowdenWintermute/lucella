import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as gameUiActions from "../../../../../store/actions/game-ui";

const MatchmakingButtons = ({ socket }) => {
  const dispatch = useDispatch();
  const [
    cancelMatchmakingButtonDisplayClass,
    setCancelMatchmakingButtonDisplayClass,
  ] = useState("chat-button-hidden");

  const matchmakingScreenIsOpen = useSelector(
    (state) => state.gameUi.matchmakingScreen.isOpen
  );

  // button visibility
  useEffect(() => {
    if (matchmakingScreenIsOpen) setCancelMatchmakingButtonDisplayClass("");
    if (!matchmakingScreenIsOpen)
      setCancelMatchmakingButtonDisplayClass("chat-button-hidden");
  }, [matchmakingScreenIsOpen]);

  // cancel game setup
  const onCancelMatchmakingSearch = () => {
    socket.emit("clientCancelsMatchmakingSearch");
    dispatch(gameUiActions.setMatchmakingWindowVisible(false));
  };

  return (
    <ul className={`pre-game-buttons`}>
      <li>
        <button
          className={`button button-standard-size button-basic game-lobby-top-buttons__button ${cancelMatchmakingButtonDisplayClass}`}
          onClick={onCancelMatchmakingSearch}
        >
          Cancel Search
        </button>
      </li>
    </ul>
  );
};

MatchmakingButtons.propTypes = {
  socket: PropTypes.object,
};

export default MatchmakingButtons;
