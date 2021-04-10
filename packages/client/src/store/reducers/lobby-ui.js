import { SET_SCORE_SCREEN_DATA, CLOSE_SCORE_SCREEN } from "../actions/types";

const initialState = {
  scoreScreenData: {},
  scoreScreenDisplayed: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_SCORE_SCREEN_DATA:
      return {
        ...state,
        scoreScreenData: { ...payload },
        scoreScreenDisplayed: true,
      };
    case CLOSE_SCORE_SCREEN:
      return {
        ...state,
        scoreScreenDisplayed: false,
      };
    default:
      return state;
  }
}
