/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import { Point } from "../../../../../common";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearContextMenu, openUserNameplateContextMenu } from "../../../redux/slices/ui-slice";
import UserNameplateContextMenu from "./UserNameplateContextMenu";
import styles from "./chat-channel-sidebar.module.scss";
import BanModal, { BanMode } from "./BanModal";

type Props = {
  username: string;
  isGuest: boolean;
  contextMenuId: number;
};

function UserNameplate({ username, isGuest, contextMenuId }: Props) {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.UI);
  const [positionClicked, setPositionClicked] = useState<Point>(new Point(0, 0));
  const [showBanUserModal, setShowBanUserModal] = useState(false);
  const [showBanUserIpAddressModal, setShowBanUserIpAddressModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button !== 2) return;
    dispatch(openUserNameplateContextMenu({ username, isGuest, contextMenuId }));
    setPositionClicked(new Point(e.clientX, e.clientY));
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    const eventTarget = e.target as HTMLButtonElement;
    if (uiState.showContextMenu) dispatch(clearContextMenu());
    else {
      dispatch(openUserNameplateContextMenu({ username, isGuest, contextMenuId }));
      setPositionClicked(new Point(eventTarget.getBoundingClientRect().left, eventTarget.getBoundingClientRect().top));
    }
  };

  return (
    <li style={{ listStyle: "none" }}>
      <button
        type="button"
        onClick={handleClick}
        className={styles["chat-channel-sidebar__user-nameplate"]}
        data-custom-context-menu-id={contextMenuId}
        onContextMenu={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleEnter(e);
        }}
        aria-controls={`context-menu-${username}`}
        aria-expanded={uiState.showContextMenu && uiState.lastElementContextId === contextMenuId}
      >
        {username}
      </button>
      {showBanUserIpAddressModal ? <BanModal banMode={BanMode.IP_ADDRESS} setParentDisplay={setShowBanUserIpAddressModal} /> : undefined}
      {showBanUserModal ? <BanModal banMode={BanMode.USER} setParentDisplay={setShowBanUserModal} /> : undefined}
      {/* nested in the ul for tab index ordering, tab focus will be placed back on the button after dismissal with enter key */}
      {uiState.showContextMenu && uiState.lastElementContextId === contextMenuId && (
        <UserNameplateContextMenu
          id={`context-menu-${username}`}
          positionClicked={positionClicked}
          setShowBanUserIpAddressModal={setShowBanUserIpAddressModal}
          setShowBanUserModal={setShowBanUserModal}
        />
      )}
    </li>
  );
}

export default UserNameplate;
