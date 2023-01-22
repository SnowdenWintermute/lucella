/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface IAuthState {
  token: string | null;
}

const initialState: IAuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.token = null;
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

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
