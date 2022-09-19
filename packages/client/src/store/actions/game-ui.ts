import { Dispatch } from "redux";
import { ActionType } from "./types";

export const viewGamesListClicked = () => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.VIEW_GAMES_LIST_CLICKED,
  });
};
export const updateGamesList = (gamesList) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.UPDATE_GAMES_LIST,
    payload: gamesList,
  });
};
export const cancelViewGamesList = () => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.CLOSE_GAME_LIST,
  });
};
export const openPreGameScreen = () => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.OPEN_PRE_GAME_SCREEN,
  });
};
export const closePreGameScreen = () => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.CLOSE_PRE_GAME_SCREEN,
  });
};
export const setCurrentGame = (gameObject) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.SET_CURRENT_GAME,
    payload: gameObject,
  });
};
export const updatePlayers = (playersObject) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.UPDATE_PLAYERS,
    payload: playersObject,
  });
};
export const updatePlayersReady = (playersReadyObject) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.UPDATE_PLAYERS_READY,
    payload: playersReadyObject,
  });
};
export const setCurrentGameStatus = (gameStatus) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.UPDATE_GAME_STATUS,
    payload: gameStatus,
  });
};
export const setCurrentGameCountdown = (countdownNumber) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.UPDATE_GAME_COUNTDOWN,
    payload: countdownNumber,
  });
};
export const updatePlayerRole = (hostOrClient) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.UPDATE_PLAYER_ROLE,
    payload: hostOrClient,
  });
};
export const setGameWinner = (data) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.SET_GAME_WINNER,
    payload: data,
  });
};
export const clearGameUiData = () => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.CLEAR_GAME_UI,
  });
};

export const setMatchmakingWindowVisible = (isOpen) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.SET_MATCHMAKING_WINDOW_VISIBLE, payload: isOpen });
};

export const setMatchmakingData = (data) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.SET_MATCHMAKING_DATA, payload: data });
};
