import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import LoadingSpinner from "../../common-components/LoadingSpinner";
import { ARIA_LABELS } from "../../../consts/aria-labels";
import UserNameplate from "./UserNameplate";

function ChatChannelSidebar() {
  const chatState = useAppSelector((state) => state.chat);
  const { newChatChannelLoading, currentChatChannelName, currentChatChannelUsers } = chatState;
  const numUsers = Object.keys(currentChatChannelUsers).length;

  const usersInChannelToDisplay: React.ReactElement[] = [];
  Object.entries(currentChatChannelUsers).forEach(([username, user], i) => {
    usersInChannelToDisplay.push(<UserNameplate key={username} username={username} isGuest={user.isGuest} contextMenuId={i + 1} />);
  });

  // for (let i = 40; i > 0; i -= 1) usersInChannelToDisplay.push(<UserNameplate key="test" username="test" isGuest contextMenuId={i + 1} />);

  return (
    <section className="chat-channel-sidebar">
      <div className="chat-channel-sidebar__header-box" aria-label={ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS}>
        <span>{newChatChannelLoading ? "" : `${currentChatChannelName} (${numUsers})`}</span>
      </div>
      <div className="chat-channel-sidebar__users-list-container" aria-label={ARIA_LABELS.CHAT.LIST_OF_USERS_IN_CHANNEL}>
        <ul className="chat-channel-sidebar__users-list">
          {newChatChannelLoading ? (
            <LoadingSpinner extraStyles="chat-channel-sidebar__loading-spinner" aria-label={ARIA_LABELS.CHAT.CHAT_CHANNEL_LOADING_INDICATOR} />
          ) : (
            usersInChannelToDisplay
          )}
        </ul>
      </div>
    </section>
  );
}

export default ChatChannelSidebar;
