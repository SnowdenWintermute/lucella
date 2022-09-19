import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

const UserList = () => {
  const chatState = useSelector((state: RootState) => state.chat);
  const { newRoomLoading, currentChatRoomUsers } = chatState;

  let usersInChannelToDisplay: React.ReactElement[] = [];
  Object.keys(currentChatRoomUsers).forEach((key) => {
    usersInChannelToDisplay.push(<div key={key}>{key}</div>);
  });
  return <div className="game-lobby-players-list">{newRoomLoading ? "..." : usersInChannelToDisplay}</div>;
};

export default UserList;
