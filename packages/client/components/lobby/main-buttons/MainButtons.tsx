import React from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../../redux/hooks";
import DefaultButtons from "./DefaultButtons";
import InGameRoomButtons from "./InGameRoomButtons";
import MatchmakingButtons from "./MatchmakingButtons";

interface Props {
  socket: Socket;
}

function MainButtons({ socket }: Props) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);

  const { currentGameRoom } = lobbyUiState;

  return (
    <div className="game-lobby-top-buttons">
      {!currentGameRoom && <DefaultButtons socket={socket} />}
      {!currentGameRoom?.isRanked && <InGameRoomButtons socket={socket} />}
      {currentGameRoom?.isRanked && <span>Ranked game starting...</span>}
      <MatchmakingButtons socket={socket} />
    </div>
  );
}

export default MainButtons;
