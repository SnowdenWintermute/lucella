/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { openUserNameplateContextMenu } from "../../../redux/slices/ui-slice";
import styles from "./user-nameplate.module.scss";

type Props = {
  username: string;
  isGuest: boolean;
  tabindex: number;
  contextMenuId: number;
};

function UserNameplate({ username, isGuest, tabindex, contextMenuId }: Props) {
  const dispatch = useAppDispatch();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 2) dispatch(openUserNameplateContextMenu({ username, isGuest, contextMenuId }));
  };

  const handleEnter = () => {
    dispatch(openUserNameplateContextMenu({ username, isGuest, contextMenuId }));
  };

  return (
    <div
      className={styles["user-nameplate"]}
      tabIndex={tabindex}
      onClick={(e) => handleClick(e)}
      data-custom-context-menu-id={contextMenuId}
      onContextMenu={(e) => handleClick(e)}
      onKeyUp={(e) => {
        if (e.key === "Enter") handleEnter();
      }}
    >
      {username}
    </div>
  );
}

export default UserNameplate;
