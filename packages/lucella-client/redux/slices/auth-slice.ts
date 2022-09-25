import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./types";

export interface IAuthState {
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  user: IUser | null;
}

const initialState: IAuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem("token");
      return initialState;
    },
    setCredentials(state, action: PayloadAction<string>) {
      localStorage.setItem("token", action.payload);
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    },
  },
});

export const { logout, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
