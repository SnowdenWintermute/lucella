import React from "react";
import ContextMenuItem from "./ContextMenuItem";
import styles from "./context-menu.module.scss";
import { useAppDispatch } from "../../../redux/hooks";
import { setShowBanUserModal } from "../../../redux/slices/ui-slice";

function UserNameplateContextMenu() {
  const dispatch = useAppDispatch();

  const handleBanUserClick = () => {
    dispatch(setShowBanUserModal(true));
  };

  return (
    <>
      <ContextMenuItem>
        <button className={styles["context-menu-button"]} type="button" onClick={handleBanUserClick}>
          BAN USER
        </button>
      </ContextMenuItem>
      <ContextMenuItem>
        <button className={styles["context-menu-button"]} type="button">
          PLACEHOLDER
        </button>
      </ContextMenuItem>
    </>
  );
}

export default UserNameplateContextMenu;
