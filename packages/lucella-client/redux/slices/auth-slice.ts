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
    setCredentials: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.token = action.payload;
    },
    logOut: (state) => {
      state.token = null;
    },
  },
});

export const { logOut, setCredentials } = authSlice.actions;
export default authSlice.reducer;
