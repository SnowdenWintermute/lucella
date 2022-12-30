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
      if (key === "Escape" || key === "Esc") hideModal();
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
    window.addEventListener("keyup", handleUserKeyPress);
    window.addEventListener("click", handleClickOutOfModal);
    return () => {
      window.removeEventListener("keyup", handleUserKeyPress);
      window.removeEventListener("click", handleClickOutOfModal);
    };
  }, [handleUserKeyPress, hideModal, handleClickOutOfModal]);

  useEffect(() => {
    setDisplayModal(isOpen);
  }, [isOpen]);

  const modalToShow = displayModal ? (
    <>
      <div className={`modal-screen ${screenClass || ""}`} id="modal-screen" />
      <div className={`modal-frame ${frameClass}`}>
        <div className="modal-top-bar">
          <div className="modal-title">{title}</div>
          <button type="button" className="modal-x-button" onClick={() => hideModal()}>
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
