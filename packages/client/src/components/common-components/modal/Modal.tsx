import { ThunkAction } from "@reduxjs/toolkit";
import React, { ReactNode } from "react";
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

const Modal = ({ isOpen, children, setParentDisplay, title, screenClass, frameClass }: Props) => {
  const dispatch = useAppDispatch();

  function handleClick() {
    dispatch(setParentDisplay(false));
  }

  const modalToShow = isOpen ? (
    <>
      <div className={`modal-screen ${screenClass || ""}`} id="modal-screen" />
      <div className={`modal-frame ${frameClass}`} id={`${title} modal`}>
        <div>
          <div className="modal-title">{title}</div>
          <button type="button" onClick={handleClick} aria-label="close" aria-controls={`${title} modal`} aria-expanded>
            x
          </button>
        </div>
        <div className="modal-divider-bar" />
        <div className="modal-content">{children}</div>
      </div>
    </>
  ) : null;

  return modalToShow;
};

export default Modal;
