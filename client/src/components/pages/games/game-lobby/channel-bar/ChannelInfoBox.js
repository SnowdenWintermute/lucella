import React from "react";
import PropTypes from "prop-types";

const ChannelInfoBox = ({ newRoomLoading, numUsers, channelName }) => {
  return (
    <div className="game-lobby-info-box">
      {channelName} ({newRoomLoading ? "..." : numUsers})
    </div>
  );
};

ChannelInfoBox.propTypes = {
  newRoomLoading: PropTypes.bool.isRequired,
};

export default ChannelInfoBox;
