import React, { useEffect, useRef } from "react";
import { Point } from "../../../common";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { hideContextMenu, setContextMenuPosition } from "../../redux/slices/ui-slice";

function ContextMenu() {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.UI);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const windowDimensions = useWindowDimensions();

  // show/hide menu
  useEffect(() => {
    const clearContextMenuIfNotClickingOnCustomContextElement = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      // console.log(windowDimensions);
      // console.log(contextMenuRef?.current?.offsetWidth, contextMenuRef?.current?.clientWidth);
      console.log(e.x, e.y);
      if (!node.getAttribute("data-custom-context-menuable")) dispatch(hideContextMenu());
    };
    const onContextMenu = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      if (!node.getAttribute("data-custom-context-menuable")) dispatch(hideContextMenu());
      if (contextMenuRef?.current?.offsetWidth && contextMenuRef?.current?.offsetHeight) {
        if (windowDimensions?.width && e.x + contextMenuRef.current.offsetWidth > windowDimensions?.width)
          dispatch(setContextMenuPosition(new Point(e.x - contextMenuRef.current.offsetWidth, e.y)));
        else dispatch(setContextMenuPosition(new Point(e.x, e.y)));
        // if (windowDimensions?.height && e.y + (contextMenuRef?.current?.offsetHeight || 0) > windowDimensions?.height)
        //   if (contextMenuRef?.current?.offsetHeight) dispatch(setContextMenuPosition(new Point(e.x, e.y - contextMenuRef.current.offsetHeight)));
      }
    };
    window.addEventListener("click", clearContextMenuIfNotClickingOnCustomContextElement);
    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("click", clearContextMenuIfNotClickingOnCustomContextElement);
    };
  }, []);

  if (uiState.showContextMenu)
    return (
      <div ref={contextMenuRef} style={{ position: "absolute", top: uiState.position.y, left: uiState.position.x, border: "1px solid red", width: "205px" }}>
        CONTEXT MENU
      </div>
    );

  return <span />;
}

export default ContextMenu;
