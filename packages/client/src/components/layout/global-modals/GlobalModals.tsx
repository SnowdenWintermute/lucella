import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { hideAllModals, setShowBanIpAddressModal, setShowBanUserModal } from "../../../redux/slices/ui-slice";
import Modal from "../../common-components/modal/Modal";
import BanIpAddressModalContents from "../../Lobby/modals/BanIpAddressModalContents";
import BanUserModalContents from "../../Lobby/modals/BanUserModalContents";

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
      {/* <Modal screenClass="" isOpen={uiState.modals.showBanUser} setParentDisplay={setShowBanUserModal} isReduxControlled title="Ban User">
        <BanUserModalContents />
      </Modal>
      <Modal screenClass="" isOpen={uiState.modals.showBanIpAddress} setParentDisplay={setShowBanIpAddressModal} isReduxControlled title="Ban IP Address">
        <BanIpAddressModalContents />
      </Modal> */}
    </div>
  );
}

export default GlobalModals;
