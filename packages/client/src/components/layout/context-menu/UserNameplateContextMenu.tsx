import React from "react";
import ContextMenuItem from "./ContextMenuItem";
import styles from "./context-menu.module.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setShowBanUserModal, setShowBanIpAddressModal } from "../../../redux/slices/ui-slice";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";
import { UserRole } from "../../../../../common";

function UserNameplateContextMenu() {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMeQuery(null);
  const uiState = useAppSelector((state) => state.UI);

  const handleBanUserClick = () => {
    dispatch(setShowBanUserModal(true));
  };

  const handleBanIpAddressClick = () => {
    dispatch(setShowBanIpAddressModal(true));
  };

  const moderatorOptions = [];
  if (!uiState.nameplateContextMenuData.isGuest)
    moderatorOptions.push(
      <ContextMenuItem key="BAN USER">
        <button className={styles["context-menu-button"]} type="button" onClick={handleBanUserClick}>
          BAN USER
        </button>
      </ContextMenuItem>
    );

  moderatorOptions.push(
    <ContextMenuItem key="BAN IP ADDRESS">
      <button className={styles["context-menu-button"]} type="button" onClick={handleBanIpAddressClick}>
        BAN IP ADDRESS
      </button>
    </ContextMenuItem>
  );

  return (
    <>
      {user && (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) && moderatorOptions}
      <ContextMenuItem>
        <button className={styles["context-menu-button"]} type="button">
          PLACEHOLDER
        </button>
      </ContextMenuItem>
    </>
  );
}

export default UserNameplateContextMenu;
