/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import styles from "./context-menu.module.scss";

function ContextMenuItem({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <li className="context-menu-item">
      <button type="button" className="button context-menu-item__button" onClick={onClick}>
        {title}
      </button>
    </li>
    // <li className={styles["context-menu-item"]}>
    //   <button type="button" className={`button ${styles["context-menu-item__button"]}`} onClick={onClick}>
    //     {title}
    //   </button>
    // </li>
  );
}

export default ContextMenuItem;
