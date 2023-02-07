import React, { useEffect, useRef } from "react";
import { Point } from "../../../../../common";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearContextMenu, setContextMenuPosition } from "../../../redux/slices/ui-slice";
import styles from "./context-menu.module.scss";
import UserNameplateContextMenu from "./UserNameplateContextMenu";

function ContextMenu() {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.UI);
  const contextMenuRef = useRef<HTMLUListElement>(null);
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      const contextMenuElementId = node.getAttribute("data-custom-context-menu-id");
      if (!contextMenuElementId || (contextMenuElementId !== null && parseInt(contextMenuElementId, 10) !== uiState.lastElementContextId))
        dispatch(clearContextMenu());
    };
    const handleContextMenu = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      const contextMenuElementId = node.getAttribute("data-custom-context-menu-id");
      if (!contextMenuElementId) dispatch(clearContextMenu());
      else if (windowDimensions?.width && windowDimensions?.height && contextMenuRef?.current?.offsetWidth && contextMenuRef?.current?.offsetHeight) {
        if (e.x + contextMenuRef.current.offsetWidth > windowDimensions?.width)
          dispatch(setContextMenuPosition(new Point(e.x - contextMenuRef.current.offsetWidth, e.y)));
        else dispatch(setContextMenuPosition(new Point(e.x, e.y)));
        if (e.y + contextMenuRef.current.offsetHeight > windowDimensions?.height)
          dispatch(setContextMenuPosition(new Point(e.x, e.y - contextMenuRef.current.offsetHeight)));
      }
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [uiState.lastElementContextId, windowDimensions]);

  if (uiState.showContextMenu)
    return (
      <ul ref={contextMenuRef} className={styles["context-menu"]} style={{ top: uiState.position.y, left: uiState.position.x }}>
        <UserNameplateContextMenu />
      </ul>
    );

  return <span />;
}

export default ContextMenu;
