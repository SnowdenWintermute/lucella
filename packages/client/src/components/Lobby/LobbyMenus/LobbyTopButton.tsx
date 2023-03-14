/* eslint-disable react/require-default-props */
import React from "react";
import styles from "./lobby-menus.module.scss";

interface Props {
  title: string | JSX.Element;
  onClick: () => void;
  displayClass: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  disabled?: boolean;
  dataCy?: string;
}

function LobbyTopButton({ title, onClick, displayClass, ariaControls, ariaExpanded, disabled, dataCy }: Props) {
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        className={`button ${styles["lobby-menus__button"]} ${displayClass}`}
        onClick={onClick}
        data-cy={dataCy}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
      >
        {title}
      </button>
    </li>
  );
}

export default LobbyTopButton;
