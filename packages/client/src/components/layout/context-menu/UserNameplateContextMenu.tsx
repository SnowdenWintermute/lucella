import React from "react";
import ContextMenuItem from "./ContextMenuItem";
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

  const moderatorOptions = [<ContextMenuItem key="BAN IP ADDRESS" title="BAN IP ADDRESS" onClick={handleBanIpAddressClick} />];
  if (!uiState.nameplateContextMenuData.isGuest) moderatorOptions.push(<ContextMenuItem key="BAN USER" title="BAN USER" onClick={handleBanUserClick} />);

  return (
    <>
      {user && (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) && moderatorOptions}
      <ContextMenuItem title="PLACEHOLDER" onClick={() => {}} />
    </>
  );
}

export default UserNameplateContextMenu;
