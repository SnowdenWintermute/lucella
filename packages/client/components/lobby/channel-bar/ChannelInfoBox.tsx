import React from "react";
import { useAppSelector } from "../../../redux";

const ChannelInfoBox = () => {
  const chatState = useAppSelector((state) => state.chat);
  const { newChatRoomLoading, currentChatRoomName, currentChatRoomUsers } = chatState;
  const numUsers = Object.keys(currentChatRoomUsers).length;
  return (
    <div className="game-lobby-info-box">
      {currentChatRoomName} ({newChatRoomLoading ? "..." : numUsers})
    </div>
  );
};

export default ChannelInfoBox;
