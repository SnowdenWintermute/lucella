import React from "react";
// import PropTypes from "prop-types";

const GameLobbyTopBar = ({ channelName, joinRoom, currentChatRoomUsers }) => {
  const onChannelClick = () => {
    console.log("channel button clicked");
  };

  const numUsersInRoom = Object.keys(currentChatRoomUsers).length;

  return (
    <div className="game-lobby-top-bar">
      <ul>
        <li>
          <button
            className="button button-basic"
            onClick={() => onChannelClick()}
          >
            Channel
          </button>
        </li>
        <li>
          <button className="button button-basic">Play Ranked</button>
        </li>
        <li>
          <button className="button button-basic">Host</button>
        </li>
        <li>
          <button className="button button-basic">Join</button>
        </li>
      </ul>
      <div className="channel-info">
        {channelName} ({numUsersInRoom})
      </div>
    </div>
  );
};

// GameLobbyTopBar.propTypes = {
// channelName: PropTypes.string.isRequired,
// numPlayersInChannel: PropTypes.number.isRequired
// };

export default GameLobbyTopBar;
