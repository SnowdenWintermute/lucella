/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { useBanAccountMutation } from "../../../redux/api-slices/users-api-slice";
import { useAppDispatch } from "../../../redux/hooks";
import { openUserNameplateContextMenu } from "../../../redux/slices/ui-slice";
import styles from "./user-nameplate.module.scss";

type Props = {
  username: string;
  tabindex: number;
  contextMenuId: number;
};

function UserNameplate({ username, tabindex, contextMenuId }: Props) {
  const dispatch = useAppDispatch();
  const [banUser, { isLoading, isError, isSuccess }] = useBanAccountMutation();

  const handleClick = (e: React.MouseEvent) => {
    console.log("clicked on ", username, e.button);
    e.preventDefault();
    if (e.button === 2) dispatch(openUserNameplateContextMenu({ username, contextMenuId }));
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    dispatch(openUserNameplateContextMenu({ username, contextMenuId }));
  };

  return (
    <div
      className={styles["user-nameplate"]}
      tabIndex={tabindex}
      onClick={(e) => handleClick(e)}
      data-custom-context-menu-id={contextMenuId}
      onContextMenu={(e) => handleClick(e)}
      onKeyUp={(e) => {
        if (e.key === "Enter") handleEnter(e);
      }}
    >
      {username}
    </div>
  );
}

export default UserNameplate;
