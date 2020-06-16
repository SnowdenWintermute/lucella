import React from "react";
import PropTypes from "prop-types";

const UserList = ({ currentChatRoomUsers }) => {
  let usersInChannelToDisplay = [];
  Object.keys(currentChatRoomUsers).forEach((key) => {
    usersInChannelToDisplay.push(<div key={key}>{key}</div>);
  });
  return (
    <div className="game-lobby-players-list">{usersInChannelToDisplay}</div>
  );
};

UserList.propTypes = {
  currentChatRoomUsers: PropTypes.object.isRequired,
};

export default UserList;
