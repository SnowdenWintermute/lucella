import { GET_LADDER_PAGE } from "../actions/types";

const initialState = {
  ladderPages: {},
  currentPage: 1,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_LADDER_PAGE:
      console.log(payload);
      return {
        ...state,
        ladderPages: { ...payload },
      };
    default:
      return state;
  }
}
