import { Action, ActionType } from "../actions/types";

export interface LadderState {
  ladderPages: { [pageNumber: number]: {} };
  totalNumberOfPages: number | null;
  searchedUserRecord: boolean | null;
  currentPage: number;
  viewingSearchedUser: boolean;
}
const initialState: LadderState = {
  ladderPages: {},
  totalNumberOfPages: null,
  searchedUserRecord: null,
  currentPage: 1,
  viewingSearchedUser: false,
};

export default function (state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_LADDER_PAGE:
      return {
        ...state,
        totalNumberOfPages: payload.totalNumberOfPages,
        ladderPages: {
          ...state.ladderPages,
          [payload.pageNumber]: payload.pageData,
        },
        viewingSearchedUser: false,
      };
    case ActionType.CHANGE_LADDER_PAGE_VIEWING:
      return {
        ...state,
        currentPage: payload,
        viewingSearchedUser: false,
      };
    case ActionType.GET_BATTLE_ROOM_USER_RECORD:
      return {
        ...state,
        searchedUserRecord: payload,
        viewingSearchedUser: true,
      };
    default:
      return state;
  }
}
