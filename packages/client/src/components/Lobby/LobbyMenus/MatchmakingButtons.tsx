import React from "react";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../../../../../common";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";
import { useAppDispatch } from "../../../redux/hooks";
import { LobbyMenu, setActiveMenu } from "../../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

function MatchmakingButtons({ socket }: Props) {
  const dispatch = useAppDispatch();

  const onCancelMatchmakingSearch = () => {
    socket.emit(SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE);
    dispatch(setActiveMenu(LobbyMenu.MAIN));
  };

  return <LobbyTopListItemWithButton title="Cancel Search" onClick={onCancelMatchmakingSearch} extraStyles="" />;
}

export default MatchmakingButtons;
