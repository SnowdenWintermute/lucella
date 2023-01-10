/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JsxElement } from "typescript";
import { Point } from "../../../common";

export interface IUISlice {
  showContextMenu: boolean;
  position: Point;
}
const initialState: IUISlice = {
  showContextMenu: false,
  position: new Point(0, 0),
};

const UISlice = createSlice({
  name: "UISlice",
  initialState,
  reducers: {
    hideContextMenu(state) {
      state.showContextMenu = false;
    },
    showContextMenu(state) {
      state.showContextMenu = true;
    },
    setContextMenuPosition(state, action: PayloadAction<Point>) {
      state.position = action.payload;
    },
  },
});

export const { hideContextMenu, showContextMenu, setContextMenuPosition } = UISlice.actions;
export default UISlice.reducer;
