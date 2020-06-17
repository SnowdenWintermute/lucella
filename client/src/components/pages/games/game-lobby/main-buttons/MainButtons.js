import React from "react";
import PropTypes from "prop-types";

import DefaultButtons from "./DefaultButtons";
import InGameButtons from "./InGameButtons";

const MainButtons = ({ socket, showChangeChannelModal }) => {
  return (
    <div className="game-lobby-top-buttons">
      <DefaultButtons
        socket={socket}
        showChangeChannelModal={showChangeChannelModal}
      />
      <InGameButtons socket={socket} />
    </div>
  );
};

MainButtons.propTypes = {
  showChangeChannelModal: PropTypes.func.isRequired,
};

export default MainButtons;
