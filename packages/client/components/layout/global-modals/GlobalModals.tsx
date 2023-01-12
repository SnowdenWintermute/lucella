import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { setShowBanUserModal } from "../../../redux/slices/ui-slice";
import Modal from "../../common-components/modal/Modal";
import BanUserModalContents from "../../lobby/BanUserModalContents";

function GlobalModals() {
  const uiState = useAppSelector((state) => state.UI);

  return (
    <div>
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={uiState.showBanUserModal}
        setParentDisplay={setShowBanUserModal}
        isReduxControlled
        title="Ban User"
      >
        <BanUserModalContents />
      </Modal>
    </div>
  );
}

export default GlobalModals;
