import React from "react";

interface Props {
  title: string;
  onClick: () => void;
  dataCy: string;
}

function GameLobbyModalButton({ title, onClick, dataCy }: Props) {
  console.log("dataCy: ", dataCy);
  return (
    <button
      type="button"
      data-cy={dataCy}
      className="button button-standard-size button-basic game-lobby-top-buttons__button game-lobby-menu-modal-button"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default GameLobbyModalButton;
