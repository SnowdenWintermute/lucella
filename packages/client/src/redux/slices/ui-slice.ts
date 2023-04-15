import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "../../../../common";

export enum Theme {
  DEFAULT = "",
  VT320 = "VT320",
  HTML = "HTML",
}

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
  theme: Theme;
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
  theme: Theme.DEFAULT,
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
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { clearContextMenu, openUserNameplateContextMenu, setContextMenuPosition, hideAllModals, setShowScoreScreenModal, setTheme } = UISlice.actions;
export default UISlice.reducer;
