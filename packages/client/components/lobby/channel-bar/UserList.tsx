import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import UserNameplate from "./UserNameplate";

function UserList() {
  const chatState = useAppSelector((state) => state.chat);
  const { newChatChannelLoading, currentChatChannelUsers } = chatState;

  const usersInChannelToDisplay: React.ReactElement[] = [];
  Object.entries(currentChatChannelUsers).forEach(([username, user], i) => {
    usersInChannelToDisplay.push(<UserNameplate key={username} username={username} isGuest={user.isGuest} tabindex={i} contextMenuId={i + 1} />);
  });
  return (
    <div className="game-lobby-players-list" aria-label="users in this channel">
      {newChatChannelLoading ? "..." : usersInChannelToDisplay}
    </div>
  );
}

export default UserList;
