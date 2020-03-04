import React from "react";
import PropTypes from "prop-types";

const GameLobbySideBar = ({ currentChatRoomUsers }) => {
  let usersInChannelToDisplay = [];
  Object.keys(currentChatRoomUsers).forEach(key => {
    usersInChannelToDisplay.push(<div key={key}>{key}</div>);
  });
  return (
    <div className="game-lobby-players-list">{usersInChannelToDisplay}</div>
  );
};

GameLobbySideBar.propTypes = {
  currentChatRoomUsers: PropTypes.object.isRequired
};

export default GameLobbySideBar;
