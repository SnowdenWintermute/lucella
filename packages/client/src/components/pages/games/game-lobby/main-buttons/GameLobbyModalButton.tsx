import React from "react";

interface Props {
  title: string;
  onClick: () => void;
}

const GameLobbyModalButton = ({ title, onClick }: Props) => {
  return (
    <button
      className={`button button-standard-size button-basic game-lobby-top-buttons__button game-lobby-menu-modal-button`}
      onClick={onClick}
    >
      Title
    </button>
  );
};

export default GameLobbyModalButton;
