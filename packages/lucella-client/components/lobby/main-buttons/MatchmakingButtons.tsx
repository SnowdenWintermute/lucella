import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as gameUiActions from "../../../../../store/actions/game-ui";
import { Socket } from "socket.io-client";
import { RootState } from "../../../../../store";
import { GameUIState } from "../../../../../store/reducers/game-ui";
import GameLobbyTopButton from "../../../../common/buttons/GameLobbyTopButton";

interface Props {
  socket: Socket;
}

const MatchmakingButtons = ({ socket }: Props) => {
  const dispatch = useDispatch();
  const [cancelMatchmakingButtonDisplayClass, setCancelMatchmakingButtonDisplayClass] = useState("chat-button-hidden");
  const gameUiState: GameUIState = useSelector((state: RootState) => state.gameUi);
  const matchmakingScreenIsOpen = gameUiState.matchmakingScreen.isOpen;

  // button visibility
  useEffect(() => {
    if (matchmakingScreenIsOpen) setCancelMatchmakingButtonDisplayClass("");
    if (!matchmakingScreenIsOpen) setCancelMatchmakingButtonDisplayClass("chat-button-hidden");
  }, [matchmakingScreenIsOpen]);

  const onCancelMatchmakingSearch = () => {
    socket.emit("clientCancelsMatchmakingSearch");
    dispatch(gameUiActions.setMatchmakingWindowVisible(false));
  };

  return (
    <ul className={`pre-game-buttons`}>
      <li>
        <GameLobbyTopButton
          title="Cancel Search"
          onClick={onCancelMatchmakingSearch}
          displayClass={cancelMatchmakingButtonDisplayClass}
        />
      </li>
    </ul>
  );
};

export default MatchmakingButtons;
