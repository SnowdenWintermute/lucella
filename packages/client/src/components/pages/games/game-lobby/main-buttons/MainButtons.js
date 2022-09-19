import React from "react";
import PropTypes from "prop-types";

import DefaultButtons from "./DefaultButtons";
import InGameRoomButtons from "./InGameRoomButtons";
import MatchmakingButtons from "./MatchmakingButtons";

const MainButtons = ({ socket, showChangeChannelModal }) => {
  return (
    <div className="game-lobby-top-buttons">
      <DefaultButtons socket={socket} showChangeChannelModal={showChangeChannelModal} />
      <InGameRoomButtons socket={socket} />
      <MatchmakingButtons socket={socket} />
    </div>
  );
};

MainButtons.propTypes = {
  showChangeChannelModal: PropTypes.func.isRequired,
};

export default MainButtons;
