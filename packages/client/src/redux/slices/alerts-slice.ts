/* eslint-disable consistent-return */

import { HYDRATE } from "next-redux-wrapper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "../../classes/Alert";

const initialState = { alerts: <Alert[]>[], nextAlertIdToAssign: 1 };

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<Alert>) {
      // it is technically possible to count to an inifinite alert id but they would only crash their own client anyway and it would take their whole life to do it
      if (state.alerts.length === 0) state.nextAlertIdToAssign = initialState.nextAlertIdToAssign;
      action.payload.id = state.nextAlertIdToAssign;
      state.alerts.push(action.payload);
      state.nextAlertIdToAssign += 1;
    },
    clearAlert(state, action: PayloadAction<number>) {
      return {
        ...state,
        alerts: [...state.alerts].filter((alert) => {
          if (!alert.id) return;
          return alert.id !== action.payload;
        }),
      };
    },
    removeOldestAlert(state) {
      state.alerts.shift();
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

export const { setAlert, clearAlert, removeOldestAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
