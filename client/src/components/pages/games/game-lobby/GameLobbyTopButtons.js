import React from "react";
import PropTypes from "prop-types";

const GameLobbyTopButtons = ({
  showChangeChannelModal,
  onHostGameClick,
  onLeaveGameClick,
  chatButtonDisplayClass,
  chatButtonsDisplayClass,
  preGameButtonDisplayClass,
}) => {
  const onChannelClick = () => {
    showChangeChannelModal();
  };
  return (
    <div className="game-lobby-top-buttons-chat">
      <ul className={`chat-buttons-list ${chatButtonsDisplayClass}`}>
        <li>
          <button
            className={`button button-basic ${chatButtonDisplayClass}`}
            onClick={() => onChannelClick()}
          >
            Channel
          </button>
        </li>
        <li>
          <button className={`button button-basic ${chatButtonDisplayClass}`}>
            Ranked
          </button>
        </li>
        <li>
          <button
            className={`button button-basic ${chatButtonDisplayClass}`}
            onClick={() => {
              onHostGameClick();
            }}
          >
            Host
          </button>
        </li>
        <li>
          <button className={`button button-basic ${chatButtonDisplayClass}`}>
            Join
          </button>
        </li>
      </ul>
      <ul className={`pre-game-buttons`}>
        <li>
          <button
            className={`button button-basic ${preGameButtonDisplayClass}`}
            onClick={() => {
              onLeaveGameClick();
            }}
          >
            Leave Game
          </button>
        </li>
      </ul>
    </div>
  );
};

GameLobbyTopButtons.propTypes = {
  showChangeChannelModal: PropTypes.func.isRequired,
};

export default GameLobbyTopButtons;
