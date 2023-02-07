import React from "react";

interface Props {
  title: string;
  onClick: () => void;
}

function GameLobbyModalButton({ title, onClick }: Props) {
  return (
    <button type="button" className="button button-standard-size button-basic game-lobby-top-buttons__button game-lobby-menu-modal-button" onClick={onClick}>
      {title}
    </button>
  );
}

export default GameLobbyModalButton;
