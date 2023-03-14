import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../../../../../common";
import GameLobbyTopButton from "./LobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { clearLobbyUi, setGameRoomDisplayVisible, setViewingGamesList } from "../../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

function InGameButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const { currentGameRoom } = useAppSelector((state) => state.lobbyUi);

  const onCancelGameSetupClick = () => {
    dispatch(setGameRoomDisplayVisible(false));
  };

  const onLeaveGameClick = () => {
    dispatch(setGameRoomDisplayVisible(false));
    dispatch(clearLobbyUi());
    socket.emit(SocketEventsFromClient.LEAVES_GAME);
  };

  if (currentGameRoom) return <GameLobbyTopButton title="Leave Game" onClick={onLeaveGameClick} displayClass="" />;
  return <GameLobbyTopButton title="Cancel" onClick={onCancelGameSetupClick} displayClass="" />;
}

export default InGameButtons;
