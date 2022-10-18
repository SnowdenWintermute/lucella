import React, { Fragment, useState, useEffect, useCallback, ReactNode } from "react";

interface Props {
  isOpen: boolean;
  children: ReactNode;
  setParentDisplay: (newValue: boolean) => void;
  title: string;
  screenClass: string;
  frameClass: string;
}

const Modal = ({ isOpen, children, setParentDisplay, title, screenClass, frameClass }: Props) => {
  const [displayModal, setDisplayModal] = useState(isOpen);

  const hideModal = useCallback(() => {
    setDisplayModal(false);
    setParentDisplay(false);
  }, [setParentDisplay]);

  const handleUserKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      if (key === "escape") hideModal();
    },
    [hideModal]
  );

  const handleClickOutOfModal = useCallback(
    (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      if (node.id === "modal-screen") hideModal();
    },
    [hideModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    window.addEventListener("click", handleClickOutOfModal);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
      window.removeEventListener("click", handleClickOutOfModal);
    };
  }, [handleUserKeyPress, hideModal, handleClickOutOfModal]);

  useEffect(() => {
    setDisplayModal(isOpen);
  }, [isOpen]);

  const modalToShow = displayModal ? (
    <Fragment>
      <div className={`modal-screen ${screenClass || ""}`} id="modal-screen"></div>
      <div className={`modal-frame ${frameClass}`}>
        <div className="modal-top-bar">
          <div className="modal-title">{title}</div>
          <div className="modal-x-button" onClick={() => hideModal()}>
            x
          </div>
        </div>
        <div className="modal-divider-bar"></div>
        <div className="modal-content">{children}</div>
      </div>{" "}
    </Fragment>
  ) : null;

  return modalToShow;
};

export default Modal;
