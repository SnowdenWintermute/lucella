import React from "react";
import PropTypes from "prop-types";

const GameLobbyTopInfoBox = ({
  newRoomLoading,
  currentChatRoomUsers,
  channelName
}) => {
  const numUsersInRoom = Object.keys(currentChatRoomUsers).length;
  return (
    <div className="game-lobby-info-box">
      {channelName} ({newRoomLoading ? "..." : numUsersInRoom})
    </div>
  );
};

GameLobbyTopInfoBox.propTypes = {
  newRoomLoading: PropTypes.bool.isRequired,
  currentChatRoomUsers: PropTypes.object.isRequired,
  channelName: PropTypes.string.isRequired
};

export default GameLobbyTopInfoBox;
