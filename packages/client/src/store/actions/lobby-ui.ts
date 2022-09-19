import { Dispatch } from "redux";
import { ActionType } from "./types";

export const setScoreScreenData = (data) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.SET_SCORE_SCREEN_DATA,
    payload: data,
  });
};
export const closeScoreScreen = () => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.CLOSE_SCORE_SCREEN,
  });
};
