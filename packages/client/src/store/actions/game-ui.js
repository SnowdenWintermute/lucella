import {
  VIEW_GAMES_LIST_CLICKED,
  OPEN_PRE_GAME_SCREEN,
  CLOSE_PRE_GAME_SCREEN,
  SET_CURRENT_GAME,
  CLOSE_GAME_LIST,
  UPDATE_PLAYERS,
  UPDATE_PLAYERS_READY,
  UPDATE_GAME_STATUS,
  UPDATE_GAME_COUNTDOWN,
  UPDATE_GAMES_LIST,
  UPDATE_PLAYER_ROLE,
  CLEAR_GAME_UI,
  SET_GAME_WINNER,
  SET_MATCHMAKING_WINDOW_VISIBLE,
  SET_MATCHMAKING_DATA,
} from "./types";

export const viewGamesListClicked = () => (dispatch) => {
  dispatch({
    type: VIEW_GAMES_LIST_CLICKED,
  });
};
export const updateGamesList = (gamesList) => (dispatch) => {
  dispatch({
    type: UPDATE_GAMES_LIST,
    payload: gamesList,
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
export const updatePlayers = (playersObject) => (dispatch) => {
  dispatch({
    type: UPDATE_PLAYERS,
    payload: playersObject,
  });
};
export const updatePlayersReady = (playersReadyObject) => (dispatch) => {
  dispatch({
    type: UPDATE_PLAYERS_READY,
    payload: playersReadyObject,
  });
};
export const setCurrentGameStatus = (gameStatus) => (dispatch) => {
  dispatch({
    type: UPDATE_GAME_STATUS,
    payload: gameStatus,
  });
};
export const setCurrentGameCountdown = (countdownNumber) => (dispatch) => {
  dispatch({
    type: UPDATE_GAME_COUNTDOWN,
    payload: countdownNumber,
  });
};
export const updatePlayerRole = (hostOrClient) => (dispatch) => {
  dispatch({
    type: UPDATE_PLAYER_ROLE,
    payload: hostOrClient,
  });
};
export const setGameWinner = (data) => (dispatch) => {
  dispatch({
    type: SET_GAME_WINNER,
    payload: data,
  });
};
export const clearGameUiData = () => (dispatch) => {
  dispatch({
    type: CLEAR_GAME_UI,
  });
};

export const setMatchmakingWindowVisible = (isOpen) => (dispatch) => {
  dispatch({ type: SET_MATCHMAKING_WINDOW_VISIBLE, payload: isOpen });
};

export const setMatchmakingData = (data) => (dispatch) => {
  dispatch({ type: SET_MATCHMAKING_DATA, payload: data });
};
