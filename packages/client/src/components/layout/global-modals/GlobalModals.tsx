import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { hideAllModals, setShowBanIpAddressModal, setShowBanUserModal } from "../../../redux/slices/ui-slice";
import Modal from "../../common-components/modal/Modal";
import BanIpAddressModalContents from "../../lobby/modals/BanIpAddressModalContents";
import BanUserModalContents from "../../lobby/modals/BanUserModalContents";

function GlobalModals() {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.UI);

  function hideModal() {
    dispatch(hideAllModals());
  }

  function handleUserKeyPress(e: KeyboardEvent) {
    const { key } = e;
    if (key === "Escape" || key === "Esc") hideModal();
  }

  function handleClickOutOfModal(e: MouseEvent) {
    console.log("clicked out of global modal listener");
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

  return (
    <div>
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={uiState.modals.showBanUser}
        setParentDisplay={setShowBanUserModal}
        isReduxControlled
        title="Ban User"
      >
        <BanUserModalContents />
      </Modal>
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={uiState.modals.showBanIpAddress}
        setParentDisplay={setShowBanIpAddressModal}
        isReduxControlled
        title="Ban IP Address"
      >
        <BanIpAddressModalContents />
      </Modal>
    </div>
  );
}

export default GlobalModals;
