import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

const ChannelInfoBox = () => {
  const chatState = useSelector((state: RootState) => state.chat);
  const { newRoomLoading, currentChatRoomName, currentChatRoomUsers } = chatState;
  const numUsers = Object.keys(currentChatRoomUsers).length;
  return (
    <div className="game-lobby-info-box">
      {currentChatRoomName} ({newRoomLoading ? "..." : numUsers})
    </div>
  );
};

export default ChannelInfoBox;
