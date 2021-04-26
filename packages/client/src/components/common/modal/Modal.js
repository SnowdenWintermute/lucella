import React, { Fragment, useState, useEffect, useCallback } from "react";

const Modal = ({
  isOpen,
  children,
  setParentDisplay,
  title,
  screenClass,
  frameClass
}) => {
  const [displayModal, setDisplayModal] = useState(isOpen);

  // hide modal
  const hideModal = useCallback(() => {
    setDisplayModal(false);
    setParentDisplay(false);
  }, [setParentDisplay]);

  // escape out
  const handleUserKeyPress = useCallback(
    e => {
      const { keyCode } = e;
      if (keyCode === 27) {
        hideModal();
      }
    },
    [hideModal]
  );
  // click out
  const handleClickOutOfModal = useCallback(
    e => {
      const { target } = e;
      if (target.id === "modal-screen") {
        hideModal();
      }
    },
    [hideModal]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress, hideModal]);
  useEffect(() => {
    window.addEventListener("click", handleClickOutOfModal);
    return () => {
      window.removeEventListener("click", handleClickOutOfModal);
    };
  }, [handleClickOutOfModal, hideModal]);
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
