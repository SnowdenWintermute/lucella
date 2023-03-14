import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import styles from "./chat-channel-sidebar.module.scss";
import UserNameplate from "./UserNameplate";

function ChatChannelSidebar() {
  const chatState = useAppSelector((state) => state.chat);
  const { newChatChannelLoading, currentChatChannelName, currentChatChannelUsers } = chatState;
  const numUsers = Object.keys(currentChatChannelUsers).length;

  const usersInChannelToDisplay: React.ReactElement[] = [];
  Object.entries(currentChatChannelUsers).forEach(([username, user], i) => {
    usersInChannelToDisplay.push(<UserNameplate key={username} username={username} isGuest={user.isGuest} tabindex={i} contextMenuId={i + 1} />);
  });

  // for (let i = 50; i > 0; i -= 1) usersInChannelToDisplay.push(<UserNameplate key={i} username="test" isGuest tabindex={i} contextMenuId={i + 1} />);

  return (
    <section className={styles["chat-channel-sidebar"]}>
      <div className={styles["chat-channel-sidebar__header-box"]} aria-label="chat channel name and number of users">
        {currentChatChannelName} ({newChatChannelLoading ? "..." : numUsers})
      </div>
      <div className={styles["chat-channel-sidebar__users-list-container"]} aria-label="users in this channel">
        <ul className={styles["chat-channel-sidebar__users-list"]}>{newChatChannelLoading ? "..." : usersInChannelToDisplay}</ul>
      </div>
    </section>
  );
}

export default ChatChannelSidebar;
