import React from "react";
import { useAppSelector } from "../../../redux/hooks";

function ChannelInfoBox() {
  const chatState = useAppSelector((state) => state.chat);
  const { newChatChannelLoading, currentChatChannelName, currentChatChannelUsers } = chatState;
  const numUsers = Object.keys(currentChatChannelUsers).length;
  return (
    <div className="game-lobby-info-box">
      {currentChatChannelName} ({newChatChannelLoading ? "..." : numUsers})
    </div>
  );
}

export default ChannelInfoBox;