import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
