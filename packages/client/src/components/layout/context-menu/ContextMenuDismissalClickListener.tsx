import React, { useEffect } from "react";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearContextMenu } from "../../../redux/slices/ui-slice";

function ContextMenuDismissalClickListener() {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.UI);
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
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [uiState.lastElementContextId, windowDimensions]);

  return <span />;
}

export default ContextMenuDismissalClickListener;
