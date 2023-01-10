import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import UserNameplate from "./UserNameplate";

function UserList() {
  const chatState = useAppSelector((state) => state.chat);
  const { newChatRoomLoading, currentChatRoomUsers } = chatState;

  const usersInChannelToDisplay: React.ReactElement[] = [];
  Object.keys(currentChatRoomUsers).forEach((key, i) => {
    usersInChannelToDisplay.push(<UserNameplate key={key} username={key} tabindex={i} />);
  });
  return (
    <div className="game-lobby-players-list" aria-label="users in this channel">
      {newChatRoomLoading ? "..." : usersInChannelToDisplay}
    </div>
  );
}

export default UserList;
