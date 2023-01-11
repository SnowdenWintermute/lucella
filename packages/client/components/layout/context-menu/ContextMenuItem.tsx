/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import styles from "./context-menu.module.scss";

type Props = {
  children: JSX.Element | JSX.Element[];
};

function ContextMenuItem({ children }: Props) {
  return <li className={styles["context-menu-item"]}>{children}</li>;
}

export default ContextMenuItem;
