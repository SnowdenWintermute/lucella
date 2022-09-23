import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  user: { name: string; socketId: string } | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const authSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setCredentials(state, action: PayloadAction<string>) {
      localStorage.setItem("token", action.payload);
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
