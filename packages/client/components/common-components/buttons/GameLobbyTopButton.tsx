import React from "react";

interface Props {
  title: string;
  onClick: () => void;
  displayClass: string;
}

function GameLobbyTopButton({ title, onClick, displayClass }: Props) {
  return (
    <button
      className={`button button-standard-size button-basic game-lobby-top-buttons__button ${displayClass}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default GameLobbyTopButton;
