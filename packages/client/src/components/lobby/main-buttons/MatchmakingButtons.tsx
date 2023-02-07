import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../../../../../common";
import GameLobbyTopButton from "../../common-components/buttons/GameLobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setMatchmakingWindowVisible } from "../../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

function MatchmakingButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const [cancelMatchmakingButtonDisplayClass, setCancelMatchmakingButtonDisplayClass] = useState("chat-button-hidden");
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const isRanked = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.isRanked;

  const matchmakingScreenIsOpen = lobbyUiState.matchmakingScreen.isOpen;

  // button visibility
  useEffect(() => {
    if (matchmakingScreenIsOpen) setCancelMatchmakingButtonDisplayClass("");
    if (!matchmakingScreenIsOpen) setCancelMatchmakingButtonDisplayClass("chat-button-hidden");
  }, [matchmakingScreenIsOpen]);

  const onCancelMatchmakingSearch = () => {
    socket.emit(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE);
    dispatch(setMatchmakingWindowVisible(false));
  };
  if (isRanked) return <span />;
  return (
    <ul className="pre-game-buttons">
      <li>
        <GameLobbyTopButton title="Cancel Search" onClick={onCancelMatchmakingSearch} displayClass={cancelMatchmakingButtonDisplayClass} />
      </li>
    </ul>
  );
}

export default MatchmakingButtons;
