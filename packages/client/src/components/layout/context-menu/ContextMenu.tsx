import React, { useEffect, useRef } from "react";
import { Point } from "../../../../../common";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearContextMenu, setContextMenuPosition } from "../../../redux/slices/ui-slice";

function ContextMenu({ id, positionClicked, children }: { id: string; positionClicked: Point; children: JSX.Element | JSX.Element[] }) {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.UI);
  const { alerts } = useAppSelector((state) => state.alerts);
  const windowDimensions = useWindowDimensions();
  const contextMenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!windowDimensions?.width || !windowDimensions?.height || !contextMenuRef?.current?.offsetWidth || !contextMenuRef?.current?.offsetHeight) return;
    if (positionClicked.x + contextMenuRef.current.offsetWidth > windowDimensions?.width)
      dispatch(setContextMenuPosition(new Point(positionClicked.x - contextMenuRef.current.offsetWidth, positionClicked.y)));
    else dispatch(setContextMenuPosition(new Point(positionClicked.x, positionClicked.y)));
    if (positionClicked.y + contextMenuRef.current.offsetHeight > windowDimensions?.height)
      dispatch(setContextMenuPosition(new Point(positionClicked.x, positionClicked.y - contextMenuRef.current.offsetHeight)));
  }, [positionClicked, windowDimensions]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      const contextMenuElementId = node.getAttribute("data-custom-context-menu-id");
      if (!contextMenuElementId || (contextMenuElementId !== null && parseInt(contextMenuElementId, 10) !== uiState.lastElementContextId))
        dispatch(clearContextMenu());
    };

    const handleUserKeyPress = (e: KeyboardEvent) => {
      const { key } = e;
      if ((key === "Escape" || key === "Esc") && !(alerts.length > 0)) dispatch(clearContextMenu());
    };

    const handleContextMenu = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      const contextMenuElementId = node.getAttribute("data-custom-context-menu-id");
      if (!contextMenuElementId) dispatch(clearContextMenu());
    };

    window.addEventListener("keyup", handleUserKeyPress);
    window.addEventListener("click", handleClick);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("keyup", handleUserKeyPress);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [uiState.lastElementContextId, windowDimensions, alerts]);

  return (
    <ul ref={contextMenuRef} id={id} className="context-menu" style={{ top: uiState.contextMenuPosition.y, left: uiState.contextMenuPosition.x }}>
      {children}
    </ul>
  );
}

export default ContextMenu;
