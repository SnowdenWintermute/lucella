import {
  VIEW_GAMES_LIST_CLICKED,
  OPEN_PRE_GAME_SCREEN,
  CLOSE_PRE_GAME_SCREEN,
  SET_CURRENT_GAME,
  CLOSE_GAME_LIST,
  UPDATE_PLAYERS_READY,
} from "./types";

export const viewGamesListClicked = () => (dispatch) => {
  dispatch({
    type: VIEW_GAMES_LIST_CLICKED,
  });
};
export const cancelViewGamesList = () => (dispatch) => {
  dispatch({
    type: CLOSE_GAME_LIST,
  });
};
export const openPreGameScreen = () => (dispatch) => {
  dispatch({
    type: OPEN_PRE_GAME_SCREEN,
  });
};
export const closePreGameScreen = () => (dispatch) => {
  dispatch({
    type: CLOSE_PRE_GAME_SCREEN,
  });
};
export const setCurrentGame = (gameObject) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_GAME,
    payload: gameObject,
  });
};
export const updatePlayersReady = (playersReadyObject) => (dispatch) => {
  dispatch({
    type: UPDATE_PLAYERS_READY,
    payload: playersReadyObject,
  });
};
