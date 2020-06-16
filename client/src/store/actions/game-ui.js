import {
  VIEW_GAMES_LIST_CLICKED,
  SETUP_NEW_GAME_CLICKED,
  CANCEL_GAME_SETUP_CLICKED,
  SET_CURRENT_GAME,
  CANCEL_VIEW_GAMES_LIST_CLICKED,
} from "./types";

export const viewGamesListClicked = () => (dispatch) => {
  dispatch({
    type: VIEW_GAMES_LIST_CLICKED,
  });
};
export const cancelViewGamesListClicked = () => (dispatch) => {
  dispatch({
    type: CANCEL_VIEW_GAMES_LIST_CLICKED,
  });
};
export const setupNewGameClicked = () => (dispatch) => {
  dispatch({
    type: SETUP_NEW_GAME_CLICKED,
  });
};
export const cancelGameSetupClicked = () => (dispatch) => {
  dispatch({
    type: CANCEL_GAME_SETUP_CLICKED,
  });
};
export const setCurrentGame = (gameObject) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_GAME,
    payload: gameObject,
  });
};
