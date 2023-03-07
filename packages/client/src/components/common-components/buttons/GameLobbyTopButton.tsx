/* eslint-disable react/require-default-props */
import React from "react";

interface Props {
  title: string | JSX.Element;
  onClick: () => void;
  displayClass: string;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
  dataCy?: string;
}

function GameLobbyTopButton({ title, onClick, displayClass, disabled, dataCy }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`button button-standard-size button-basic game-lobby-top-buttons__button ${displayClass}`}
      onClick={onClick}
      data-cy={dataCy}
    >
      {title}
    </button>
  );
}

export default GameLobbyTopButton;
