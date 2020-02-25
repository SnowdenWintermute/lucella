import React from "react";
// import PropTypes from "prop-types";

const GameLobbyTopBar = ({ channelName, numPlayersInChannel }) => {
  return (
    <div className="game-lobby-top-bar">
      <ul>
        <li>
          <button className="button button-basic">Channel</button>
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
        ChannelName: {channelName} (2{numPlayersInChannel})
      </div>
    </div>
  );
};

// GameLobbyTopBar.propTypes = {
// channelName: PropTypes.string.isRequired,
// numPlayersInChannel: PropTypes.number.isRequired
// };

export default GameLobbyTopBar;
