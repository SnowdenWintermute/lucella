import React from "react";

interface Props {
  title: string | JSX.Element;
  onClick: () => void;
  displayClass: string;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
}

function GameLobbyTopButton({ title, onClick, displayClass, disabled }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`button button-standard-size button-basic game-lobby-top-buttons__button ${displayClass}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default GameLobbyTopButton;
