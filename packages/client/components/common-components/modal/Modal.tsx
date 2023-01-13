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

const Modal = ({ isOpen, children, setParentDisplay, title, screenClass, frameClass }: Props) => {
  const dispatch = useAppDispatch();

  function handleClick() {
    console.log("modal x button");
    dispatch(setParentDisplay(false));
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
