import { HYDRATE } from "next-redux-wrapper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "../../classes/Alert";

const initialState = { alerts: <Alert[]>[] };

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<Alert>) {
      state.alerts.push(action.payload);
    },
    clearAlert(state, action: PayloadAction<string>) {
      return {
        ...state,
        alerts: [...state.alerts].filter((alert) => {
          return alert.id !== action.payload;
        }),
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log("HYDRATE", state, action.payload);
      return {
        ...state,
        ...action.payload.subject,
      };
    },
  },
});

export const { setAlert, clearAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
