import React from "react";

interface Props {
  title: string | JSX.Element;
  onClick: () => void;
  extraStyles: string;
  children?: JSX.Element | JSX.Element[] | false;
  ariaControls?: string;
  ariaExpanded?: boolean;
  disabled?: boolean;
  dataCy?: string;
}

function LobbyTopListItemWithButton({ title, onClick, extraStyles, children, ariaControls, ariaExpanded, disabled, dataCy }: Props) {
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        className={`button lobby-menus__top-button ${extraStyles}`}
        onClick={onClick}
        data-cy={dataCy}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
      >
        {title}
      </button>
      {/* modal should be nested here for tab index ordering, tab focus will be placed back on the button after dismissal with enter key */}
      {children}
    </li>
  );
}

export default LobbyTopListItemWithButton;
