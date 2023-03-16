import React from "react";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../../../../../common";
import GameLobbyTopButton from "./LobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setMatchmakingWindowVisible } from "../../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

function MatchmakingButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const isRanked = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.isRanked;

  const onCancelMatchmakingSearch = () => {
    socket.emit(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE);
    dispatch(setMatchmakingWindowVisible(false));
  };

  if (isRanked) return null; // don't want to show the button if a match was found
  return <GameLobbyTopButton title="Cancel Search" onClick={onCancelMatchmakingSearch} extraStyles="" />;
}

export default MatchmakingButtons;
