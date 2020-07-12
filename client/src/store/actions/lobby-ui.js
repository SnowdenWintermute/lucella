import { SET_SCORE_SCREEN_DATA, CLOSE_SCORE_SCREEN } from "./types";

export const setScoreScreenData = (data) => (dispatch) => {
  dispatch({
    type: SET_SCORE_SCREEN_DATA,
    payload: data,
  });
};
export const closeScoreScreen = (data) => (dispatch) => {
  dispatch({
    type: CLOSE_SCORE_SCREEN,
  });
};
