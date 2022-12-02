import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
});

export const { setViewingSearchedUser } = ladderSlice.actions;
export default ladderSlice.reducer;
