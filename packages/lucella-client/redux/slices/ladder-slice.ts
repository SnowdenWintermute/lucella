import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRecord } from "../../classes/UserRecord";
import { ILadderPageResponse } from "../api-slices/ladder-api-slice";

export interface ILadderState {
  ladderPages: {
    [pageNumber: number]: UserRecord[];
  };
  totalNumberOfPages: number | null;
  searchedUserRecord: UserRecord | null;
  currentPage: number;
  viewingSearchedUser: boolean;
}
const initialState: ILadderState = {
  ladderPages: {},
  totalNumberOfPages: null,
  searchedUserRecord: null,
  currentPage: 1,
  viewingSearchedUser: false,
};

const ladderSlice = createSlice({
  name: "ladder",
  initialState,
  reducers: {
    setLadderPageData(state, action: PayloadAction<ILadderPageResponse>) {
      const { payload } = action;
      state.currentPage = payload.pageNumber;
      state.totalNumberOfPages = payload.totalNumberOfPages;
      state.ladderPages[payload.pageNumber] = payload.pageData;
      state.viewingSearchedUser = false;
    },
    setLadderPageViewing(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
      state.viewingSearchedUser = false;
    },
    setSearchedUserData(state, action: PayloadAction<UserRecord>) {
      state.viewingSearchedUser = false;
      state.searchedUserRecord = action.payload;
    },
  },
});

export const { setLadderPageData, setLadderPageViewing, setSearchedUserData } = ladderSlice.actions;
export default ladderSlice.reducer;
