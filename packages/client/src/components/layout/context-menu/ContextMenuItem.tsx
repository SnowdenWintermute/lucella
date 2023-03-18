/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";

function ContextMenuItem({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <li className="context-menu-item">
      <button type="button" className="button context-menu-item__button" onClick={onClick}>
        {title}
      </button>
    </li>
  );
}

export default ContextMenuItem;
