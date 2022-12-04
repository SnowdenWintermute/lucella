import React from "react";
import { useAppSelector } from "../../../redux/hooks";

const UserList = () => {
  const chatState = useAppSelector((state) => state.chat);
  const { newChatRoomLoading, currentChatRoomUsers } = chatState;

  let usersInChannelToDisplay: React.ReactElement[] = [];
  Object.keys(currentChatRoomUsers).forEach((key) => {
    usersInChannelToDisplay.push(<div key={key}>{key}</div>);
  });
  return (
    <div className="game-lobby-players-list" aria-label="users in this channel">
      {newChatRoomLoading ? "..." : usersInChannelToDisplay}
    </div>
  );
};

export default UserList;
