/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from "react";
import { Point } from "../../../../../common";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { openUserNameplateContextMenu, setContextMenuPosition } from "../../../redux/slices/ui-slice";
import UserNameplateContextMenu from "../../layout/context-menu/UserNameplateContextMenu";
import styles from "./chat-channel-sidebar.module.scss";

type Props = {
  username: string;
  isGuest: boolean;
  contextMenuId: number;
};

function UserNameplate({ username, isGuest, contextMenuId }: Props) {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.UI);
  const windowDimensions = useWindowDimensions();
  const contextMenuRef = useRef<HTMLUListElement>(null);
  const [positionClicked, setPositionClicked] = useState<Point>(new Point(0, 0));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 2) dispatch(openUserNameplateContextMenu({ username, isGuest, contextMenuId }));
    console.log(
      windowDimensions?.width,
      windowDimensions?.height,
      contextMenuRef?.current?.offsetWidth,
      contextMenuRef?.current?.offsetHeight,
      contextMenuRef?.current
    );
    setPositionClicked(new Point(e.clientX, e.clientY));
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    const eventTarget = e.target as HTMLButtonElement;
    dispatch(setContextMenuPosition(new Point(eventTarget?.offsetLeft, eventTarget?.offsetTop)));
    dispatch(openUserNameplateContextMenu({ username, isGuest, contextMenuId }));
  };

  useEffect(() => {
    if (!windowDimensions?.width || !windowDimensions?.height || !contextMenuRef?.current?.offsetWidth || !contextMenuRef?.current?.offsetHeight) return;
    if (positionClicked.x + contextMenuRef.current.offsetWidth > windowDimensions?.width)
      dispatch(setContextMenuPosition(new Point(positionClicked.x - contextMenuRef.current.offsetWidth, positionClicked.y)));
    else dispatch(setContextMenuPosition(new Point(positionClicked.x, positionClicked.y)));
    if (positionClicked.y + contextMenuRef.current.offsetHeight > windowDimensions?.height)
      dispatch(setContextMenuPosition(new Point(positionClicked.x, positionClicked.y - contextMenuRef.current.offsetHeight)));
  }, [positionClicked, windowDimensions]);

  return (
    <li style={{ listStyle: "none" }}>
      <button
        type="button"
        onClick={handleClick}
        className={styles["chat-channel-sidebar__user-nameplate"]}
        data-custom-context-menu-id={contextMenuId}
        onContextMenu={handleClick}
        onKeyUp={(e) => {
          if (e.key === "Enter") handleEnter(e);
        }}
        aria-controls={`context-menu-${username}`}
        aria-expanded={uiState.showContextMenu && uiState.lastElementContextId === contextMenuId}
      >
        {username}
      </button>
      {/* nested in the ul for tab index ordering, tab focus will be placed back on the button after dismissal with enter key */}
      {uiState.showContextMenu && uiState.lastElementContextId === contextMenuId && (
        <ul
          ref={contextMenuRef}
          id={`context-menu-${username}`}
          className="context-menu"
          style={{ top: uiState.contextMenuPosition.y, left: uiState.contextMenuPosition.x }}
        >
          <UserNameplateContextMenu />
        </ul>
      )}
    </li>
  );
}

export default UserNameplate;
