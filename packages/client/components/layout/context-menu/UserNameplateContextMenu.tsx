import React from "react";
import ContextMenuItem from "./ContextMenuItem";
import styles from "./context-menu.module.scss";
import { useAppSelector } from "../../../redux/hooks";
import { useBanAccountMutation } from "../../../redux/api-slices/users-api-slice";

function UserNameplateContextMenu() {
  const uiState = useAppSelector((state) => state.UI);
  const [banUser, { isLoading, isError, isSuccess }] = useBanAccountMutation();

  const handleBanUserClick = () => {
    console.log("ban user ", uiState.nameplateContextMenuData.username);
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
          BAN USER
        </button>
      </ContextMenuItem>
    </>
  );
}

export default UserNameplateContextMenu;
