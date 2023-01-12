import { ThunkAction } from "@reduxjs/toolkit";
import React, { useEffect, ReactNode } from "react";
import { useAppDispatch } from "../../../redux/hooks";

interface Props {
  isOpen: boolean;
  children: ReactNode;
  // @ts-ignore
  setParentDisplay: (newValue: boolean) => void | ThunkAction;
  title: string;
  screenClass: string;
  frameClass: string;
  isReduxControlled?: boolean;
}

const Modal = ({ isOpen, children, setParentDisplay, title, screenClass, frameClass, isReduxControlled }: Props) => {
  const dispatch = useAppDispatch();

  function hideModal() {
    if (isReduxControlled) dispatch(setParentDisplay(false));
    else setParentDisplay(false);
  }

  function handleUserKeyPress(e: KeyboardEvent) {
    console.log("esc listener in modal", title);
    const { key } = e;
    if (key === "Escape" || key === "Esc") hideModal();
  }

  function handleClickOutOfModal(e: MouseEvent) {
    console.log("clicked out of modal", title);
    const node = e.target as HTMLElement;
    if (node.id === "modal-screen") hideModal();
  }

  useEffect(() => {
    window.addEventListener("keyup", handleUserKeyPress);
    window.addEventListener("click", handleClickOutOfModal);
    return () => {
      window.removeEventListener("keyup", handleUserKeyPress);
      window.removeEventListener("click", handleClickOutOfModal);
    };
  }, []);

  function handleClick() {
    console.log("modal x button");
    hideModal();
  }

  const modalToShow = isOpen ? (
    <>
      <div className={`modal-screen ${screenClass || ""}`} id="modal-screen" />
      <div className={`modal-frame ${frameClass}`}>
        <div className="modal-top-bar">
          <div className="modal-title">{title}</div>
          <button type="button" className="modal-x-button" onClick={handleClick}>
            x
          </button>
        </div>
        <div className="modal-divider-bar" />
        <div className="modal-content">{children}</div>
      </div>{" "}
    </>
  ) : null;

  return modalToShow;
};

export default Modal;
