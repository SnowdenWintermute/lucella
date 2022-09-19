import React from "react";
import { Socket } from "socket.io-client";
import DefaultButtons from "./DefaultButtons";
import InGameRoomButtons from "./InGameRoomButtons";
import MatchmakingButtons from "./MatchmakingButtons";

interface Props {
  socket: Socket;
  showChangeChannelModal: () => void;
}

const MainButtons = ({ socket, showChangeChannelModal }: Props) => {
  return (
    <div className="game-lobby-top-buttons">
      <DefaultButtons socket={socket} showChangeChannelModal={showChangeChannelModal} />
      <InGameRoomButtons socket={socket} />
      <MatchmakingButtons socket={socket} />
    </div>
  );
};

export default MainButtons;
