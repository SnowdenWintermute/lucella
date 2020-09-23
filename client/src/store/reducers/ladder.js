import {
  GET_LADDER_PAGE,
  CHANGE_LADDER_PAGE_VIEWING,
  GET_BATTLE_ROOM_USER_RECORD,
} from "../actions/types";

const initialState = {
  ladderPages: {},
  searchedUserRecord: null,
  currentPage: 1,
  viewingSearchedUser: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_LADDER_PAGE:
      console.log(payload);
      return {
        ...state,
        totalNumberOfPages: payload.totalNumberOfPages,
        ladderPages: {
          ...state.ladderPages,
          [payload.pageNumber]: payload.pageData,
        },
      };
    case CHANGE_LADDER_PAGE_VIEWING:
      return {
        ...state,
        currentPage: payload,
        viewingSearchedUser: false,
      };
    case GET_BATTLE_ROOM_USER_RECORD:
      return {
        ...state,
        searchedUserRecord: payload,
        viewingSearchedUser: true,
      };
    default:
      return state;
  }
}