import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface ILadderState {
  totalNumberOfPages: number | null;
  viewingSearchedUser: boolean;
}
const initialState: ILadderState = {
  totalNumberOfPages: null,
  viewingSearchedUser: false,
};

const ladderSlice = createSlice({
  name: "ladder",
  initialState,
  reducers: {
    setViewingSearchedUser(state, action: PayloadAction<boolean>) {
      state.viewingSearchedUser = action.payload;
    },
  },
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload.auth,
  //     };
  //   },
  // },
});

export const { setViewingSearchedUser } = ladderSlice.actions;
export default ladderSlice.reducer;
