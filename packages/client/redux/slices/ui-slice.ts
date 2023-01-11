/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "../../../common";

export interface IUISlice {
  showContextMenu: boolean;
  position: Point;
  nameplateContextMenuData: {
    username: string;
  };
  lastElementContextId: number | null;
}
const initialState: IUISlice = {
  showContextMenu: false,
  position: new Point(0, 0),
  nameplateContextMenuData: {
    username: "",
  },
  lastElementContextId: null,
};

const UISlice = createSlice({
  name: "UISlice",
  initialState,
  reducers: {
    clearContextMenu(state) {
      Object.keys(state).forEach((key) => {
        // @ts-ignore
        if (key !== "position") state[key] = initialState[key];
      });
    },
    openUserNameplateContextMenu(state, action: PayloadAction<{ username: string; contextMenuId: number }>) {
      state.showContextMenu = true;
      state.nameplateContextMenuData.username = action.payload.username;
      console.log("action.payload.contextMenuId", action.payload.contextMenuId);
      state.lastElementContextId = action.payload.contextMenuId;
    },
    setContextMenuPosition(state, action: PayloadAction<Point>) {
      state.position = action.payload;
    },
  },
});

export const { clearContextMenu, openUserNameplateContextMenu, setContextMenuPosition } = UISlice.actions;
export default UISlice.reducer;
