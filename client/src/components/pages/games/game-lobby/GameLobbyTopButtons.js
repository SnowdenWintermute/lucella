import React from "react";
import PropTypes from "prop-types";

const GameLobbyTopButtons = ({
  showChangeChannelModal,
  onHostGameClick,
  onLeaveGameClick,
  onViewGamesListClick,
  chatButtonDisplayClass,
  chatButtonsDisplayClass,
  preGameButtonDisplayClass,
  gameListButtonDisplayClass,
  onJoinGameBackClick,
}) => {
  const onChannelClick = () => {
    showChangeChannelModal();
  };
  return (
    <div className="game-lobby-top-buttons">
      <ul className={`chat-buttons-list ${chatButtonsDisplayClass}`}>
        <li>
          <button
            className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
            onClick={() => onChannelClick()}
          >
            Channel
          </button>
        </li>
        <li>
          <button
            className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
          >
            Ranked
          </button>
        </li>
        <li>
          <button
            className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
            onClick={() => {
              onHostGameClick();
            }}
          >
            Host
          </button>
        </li>
        <li>
          <button
            className={`button button-basic game-lobby-top-buttons__button ${chatButtonDisplayClass}`}
            onClick={() => onViewGamesListClick()}
          >
            Join
          </button>
        </li>
      </ul>
      <ul className={`pre-game-buttons`}>
        <li>
          <button
            className={`button button-basic game-lobby-top-buttons__button ${preGameButtonDisplayClass}`}
            onClick={() => {
              onLeaveGameClick();
            }}
          >
            Leave Game
          </button>
        </li>
        <li>
          <button
            className={`button button-basic game-lobby-top-buttons__button ${gameListButtonDisplayClass}`}
            onClick={() => {
              onJoinGameBackClick();
            }}
          >
            Back
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
