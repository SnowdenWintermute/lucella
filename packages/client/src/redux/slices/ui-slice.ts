/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "../../../../common";

export interface IUISlice {
  showContextMenu: boolean;
  contextMenuPosition: Point;
  nameplateContextMenuData: {
    username: string;
    isGuest: boolean;
  };
  lastElementContextId: number | null;
  modals: {
    scoreScreen: boolean;
  };
}
const initialState: IUISlice = {
  showContextMenu: false,
  contextMenuPosition: new Point(0, 0),
  nameplateContextMenuData: {
    username: "",
    isGuest: true,
  },
  lastElementContextId: null,
  modals: {
    scoreScreen: false,
  },
};

const UISlice = createSlice({
  name: "UISlice",
  initialState,
  reducers: {
    hideAllModals(state) {
      Object.keys(state.modals).forEach((key) => {
        // @ts-ignore
        state.modals[key] = false;
      });
    },
    clearContextMenu(state) {
      state.showContextMenu = false;
    },
    openUserNameplateContextMenu(state, action: PayloadAction<{ username: string; isGuest: boolean; contextMenuId: number }>) {
      console.log(action.payload);
      state.showContextMenu = true;
      state.nameplateContextMenuData.username = action.payload.username;
      state.nameplateContextMenuData.isGuest = action.payload.isGuest;
      state.lastElementContextId = action.payload.contextMenuId;
    },
    setContextMenuPosition(state, action: PayloadAction<Point>) {
      state.contextMenuPosition = action.payload;
    },
    setShowScoreScreenModal(state, action: PayloadAction<boolean>) {
      state.modals.scoreScreen = action.payload;
    },
  },
});

export const { clearContextMenu, openUserNameplateContextMenu, setContextMenuPosition, hideAllModals, setShowScoreScreenModal } = UISlice.actions;
export default UISlice.reducer;
