import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "../classes/Alert";

const initialState: Alert[] = [];

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<Alert>) {
      state.push(action.payload);
    },
    clearAlert(state, action: PayloadAction<string>) {
      state.filter((alert) => alert.id !== action.payload);
    },
  },
});

export const { setAlert, clearAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
