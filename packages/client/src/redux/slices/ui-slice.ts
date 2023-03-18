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
    showBanUser: boolean;
    showBanIpAddress: boolean;
    deleteAccount: boolean;
    changeChatChannel: boolean;
    mobileLobbyMenuModal: boolean;
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
    showBanUser: false,
    showBanIpAddress: false,
    deleteAccount: false,
    changeChatChannel: false,
    mobileLobbyMenuModal: false,
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
    setShowDeleteAccountModal(state, action: PayloadAction<boolean>) {
      state.modals.deleteAccount = action.payload;
    },
    setShowChangeChatChannelModal(state, action: PayloadAction<boolean>) {
      state.modals.changeChatChannel = action.payload;
    },
    setShowBanUserModal(state, action: PayloadAction<boolean>) {
      state.modals.showBanUser = action.payload;
    },
    setShowBanIpAddressModal(state, action: PayloadAction<boolean>) {
      state.modals.showBanIpAddress = action.payload;
    },
    setShowMobileLobbyMenuModal(state, action: PayloadAction<boolean>) {
      state.modals.mobileLobbyMenuModal = action.payload;
    },
    setShowScoreScreenModal(state, action: PayloadAction<boolean>) {
      state.modals.scoreScreen = action.payload;
    },
  },
});

export const {
  clearContextMenu,
  openUserNameplateContextMenu,
  setContextMenuPosition,
  setShowBanUserModal,
  setShowBanIpAddressModal,
  hideAllModals,
  setShowDeleteAccountModal,
  setShowChangeChatChannelModal,
  setShowMobileLobbyMenuModal,
  setShowScoreScreenModal,
} = UISlice.actions;
export default UISlice.reducer;
