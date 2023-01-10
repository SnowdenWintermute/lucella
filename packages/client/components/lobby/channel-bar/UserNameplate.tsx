/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import { Point } from "../../../../common";
import { useBanAccountMutation } from "../../../redux/api-slices/users-api-slice";
import { useAppDispatch } from "../../../redux/hooks";
import { showContextMenu } from "../../../redux/slices/ui-slice";

type Props = {
  username: string;
  tabindex: number;
};

function UserNameplate({ username, tabindex }: Props) {
  const dispatch = useAppDispatch();
  const [banUser, { isLoading, isError, isSuccess }] = useBanAccountMutation();

  const handleClick = (e: React.MouseEvent) => {
    console.log("clicked on ", username, e.button);
    e.preventDefault();
    if (e.button === 2) dispatch(showContextMenu());
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    dispatch(showContextMenu());
  };

  return (
    <div
      tabIndex={tabindex}
      onClick={(e) => handleClick(e)}
      data-custom-context-menuable
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
