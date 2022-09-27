import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import GameLobbyTopButton from "../../../components/common/buttons/GameLobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux";
import { setMatchmakingWindowVisible } from "../../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

const MatchmakingButtons = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const [cancelMatchmakingButtonDisplayClass, setCancelMatchmakingButtonDisplayClass] = useState("chat-button-hidden");
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const matchmakingScreenIsOpen = lobbyUiState.matchmakingScreen.isOpen;

  // button visibility
  useEffect(() => {
    if (matchmakingScreenIsOpen) setCancelMatchmakingButtonDisplayClass("");
    if (!matchmakingScreenIsOpen) setCancelMatchmakingButtonDisplayClass("chat-button-hidden");
  }, [matchmakingScreenIsOpen]);

  const onCancelMatchmakingSearch = () => {
    socket.emit("clientCancelsMatchmakingSearch");
    dispatch(setMatchmakingWindowVisible(false));
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
