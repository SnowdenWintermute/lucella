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
  showBanUserModal: boolean;
}
const initialState: IUISlice = {
  showContextMenu: false,
  position: new Point(0, 0),
  nameplateContextMenuData: {
    username: "",
  },
  lastElementContextId: null,
  showBanUserModal: false,
};

const UISlice = createSlice({
  name: "UISlice",
  initialState,
  reducers: {
    clearContextMenu(state) {
      state.showContextMenu = false;
    },
    openUserNameplateContextMenu(state, action: PayloadAction<{ username: string; contextMenuId: number }>) {
      state.showContextMenu = true;
      state.nameplateContextMenuData.username = action.payload.username;
      state.lastElementContextId = action.payload.contextMenuId;
    },
    setContextMenuPosition(state, action: PayloadAction<Point>) {
      state.position = action.payload;
    },
    setShowBanUserModal(state, action: PayloadAction<boolean>) {
      console.log("setting showBanUserModal ", action.payload);
      state.showBanUserModal = action.payload;
    },
  },
});

export const { clearContextMenu, openUserNameplateContextMenu, setContextMenuPosition, setShowBanUserModal } = UISlice.actions;
export default UISlice.reducer;
