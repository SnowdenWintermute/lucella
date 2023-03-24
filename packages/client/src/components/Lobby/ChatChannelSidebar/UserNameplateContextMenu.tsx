import React from "react";
import { useDispatch } from "react-redux";
import ContextMenuItem from "../../layout/ContextMenu/ContextMenuItem";
import { useAppSelector } from "../../../redux/hooks";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";
import { Point, UserRole } from "../../../../../common";
import { clearContextMenu } from "../../../redux/slices/ui-slice";
import ContextMenu from "../../layout/ContextMenu";

type Props = {
  id: string;
  positionClicked: Point;
  setShowBanUserIpAddressModal: (isOpen: boolean) => void;
  setShowBanUserModal: (isOpen: boolean) => void;
};

function UserNameplateContextMenu({ id, positionClicked, setShowBanUserIpAddressModal, setShowBanUserModal }: Props) {
  const dispatch = useDispatch();
  const uiState = useAppSelector((state) => state.UI);
  const { data: user } = useGetMeQuery(null);

  const handleBanIpAddressClick = () => {
    dispatch(clearContextMenu());
    setShowBanUserIpAddressModal(true);
  };

  const handleBanUserClick = () => {
    dispatch(clearContextMenu());
    setShowBanUserModal(true);
  };

  const userOptions = [<ContextMenuItem key="PLACEHOLDER" title="PLACEHOLDER" onClick={() => {}} />];
  const moderatorOptions = [<ContextMenuItem key="BAN IP ADDRESS" title="BAN IP ADDRESS" onClick={handleBanIpAddressClick} />];
  if (!uiState.nameplateContextMenuData.isGuest) moderatorOptions.push(<ContextMenuItem key="BAN USER" title="BAN USER" onClick={handleBanUserClick} />);
  moderatorOptions.push(...userOptions);

  return (
    <ContextMenu id={id} positionClicked={positionClicked}>
      {user && (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) ? moderatorOptions : userOptions}
    </ContextMenu>
  );
}

export default UserNameplateContextMenu;
