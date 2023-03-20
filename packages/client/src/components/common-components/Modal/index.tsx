import React, { ReactNode, useEffect } from "react";
import XShape from "../../../img/basic-shapes/x-shape.svg";
import styles from "./modal.module.scss";

interface Props {
  children: ReactNode;
  setParentDisplay: (newValue: boolean) => void;
  title: string;
  backdropStyle?: string;
  extraStyles?: string;
  noPadding?: boolean;
}

function Modal({ children, setParentDisplay, title, backdropStyle, extraStyles, noPadding }: Props) {
  function handleClickCloseModalButton() {
    setParentDisplay(false);
  }

  function handleUserKeyPress(e: KeyboardEvent) {
    const { key } = e;
    if (key === "Escape" || key === "Esc") setParentDisplay(false);
  }

  function handleClickOutOfModal(e: MouseEvent) {
    const node = e.target as HTMLElement;
    if (node.id === "modal__fullscreen-backdrop") setParentDisplay(false);
  }

  useEffect(() => {
    window.addEventListener("keyup", handleUserKeyPress);
    window.addEventListener("click", handleClickOutOfModal);
    return () => {
      window.removeEventListener("keyup", handleUserKeyPress);
      window.removeEventListener("click", handleClickOutOfModal);
    };
  }, []);

  return (
    <div className={`${styles["modal__fullscreen-backdrop"]} ${backdropStyle || ""}`} id="modal__fullscreen-backdrop">
      <div className={`${styles["modal"]} ${extraStyles}`} id={`${title} modal`}>
        <div className={styles["modal__top-bar"]}>
          <span className={styles["modal__title"]}>{title}</span>
          <button
            type="button"
            autoFocus
            className={styles["modal__x-button"]}
            onClick={handleClickCloseModalButton}
            aria-label={`close ${title} modal`}
            aria-controls={`${title} modal`}
            aria-expanded
          >
            <XShape className={styles["modal__x-button-svg"]} />
          </button>
        </div>
        <div className={!noPadding ? styles["modal__content"] : ""}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
