import React, { ReactNode, useEffect } from "react";
import XShape from "../../../img/basic-shapes/x-shape.svg";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  children: ReactNode;
  setParentDisplay: (newValue: boolean) => void;
  title: string;
  backdropStyle?: string;
  extraStyles?: string;
  noPadding?: boolean;
  ariaLabel?: string;
}

function Modal({ children, setParentDisplay, title, backdropStyle, extraStyles, noPadding, ariaLabel }: Props) {
  const { alerts } = useAppSelector((state) => state.alerts);

  function handleClickCloseModalButton() {
    setParentDisplay(false);
  }

  function handleUserKeyPress(e: KeyboardEvent) {
    const { key } = e;
    console.log("modal detected keypress");
    if ((key === "Escape" || key === "Esc") && !(alerts.length > 0)) setParentDisplay(false);
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
  }, [alerts]);

  return (
    <div className={`modal__fullscreen-backdrop ${backdropStyle || ""}`} id="modal__fullscreen-backdrop" aria-label={ariaLabel}>
      <div className={`modal ${extraStyles}`} id={`${title} modal`}>
        <div className="modal__top-bar">
          <span className="modal__title">{title}</span>
          <button
            type="button"
            autoFocus
            className="modal__x-button"
            onClick={handleClickCloseModalButton}
            aria-label={`close ${title} modal`}
            aria-controls={`${title} modal`}
            aria-expanded
          >
            <XShape className="modal__x-button-svg" />
          </button>
        </div>
        <div className={!noPadding ? "modal__content" : ""}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
