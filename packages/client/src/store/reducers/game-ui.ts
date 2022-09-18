import { GameStatus } from "@lucella/common/battleRoomGame/enums";
import * as actions from "../actions/types";

const initialState = {
  gameList: {
    games: {},
    isOpen: false,
  },
  preGameScreen: {
    isOpen: false,
  },
  matchmakingScreen: {
    isOpen: false,
    currentData: {},
  },
  currentGameName: "",
  playersInGame: {},
  playersReady: {
    host: false,
    challenger: false,
  },
  countdownNumber: null,
  gameStatus: GameStatus.IN_LOBBY,
  playerRole: null,
  winner: null,
  scoreScreenData: {},
  scoreScreenDisplayed: false,
  isRanked: null,
};

export default function (state: typeof initialState = initialState, action: { type: string; payload: any }) {
  const { type, payload } = action;
  switch (type) {
    case actions.VIEW_GAMES_LIST_CLICKED:
      return {
        ...state,
        gameList: { isOpen: true },
      };
    case actions.UPDATE_GAMES_LIST:
      return {
        ...state,
        gameList: {
          ...state.gameList,
          games: payload,
        },
      };
    case actions.CLOSE_GAME_LIST:
      return {
        ...state,
        gameList: { isOpen: false },
      };
    case actions.OPEN_PRE_GAME_SCREEN:
      return {
        ...state,
        preGameScreen: { isOpen: true },
      };
    case actions.CLOSE_PRE_GAME_SCREEN:
      return {
        ...state,
        preGameScreen: { isOpen: false },
      };
    case actions.SET_CURRENT_GAME:
      return {
        ...state,
        currentGameName: payload?.gameName || null,
        playersInGame: payload?.players || null,
        playersReady: payload?.playersReady || null,
        countdownNumber: payload?.countdown || null,
        gameStatus: payload?.gameStatus || null,
        isRanked: payload?.isRanked || null,
      };
    case actions.UPDATE_PLAYERS:
      return {
        ...state,
        playersInGame: { ...payload },
      };

    case actions.UPDATE_PLAYERS_READY:
      return {
        ...state,
        playersReady: { ...payload },
      };
    case actions.UPDATE_GAME_COUNTDOWN:
      return {
        ...state,
        countdownNumber: payload,
      };
    case actions.UPDATE_GAME_STATUS:
      return {
        ...state,
        gameStatus: payload,
      };
    case actions.UPDATE_PLAYER_ROLE:
      return {
        ...state,
        playerRole: payload,
      };
    case actions.SET_GAME_WINNER:
      return {
        ...state,
        winner: payload,
      };
    case actions.CLEAR_GAME_UI:
      return initialState;
    case actions.SET_SCORE_SCREEN_DATA:
      return {
        ...state,
        scoreScreenData: { ...payload },
        scoreScreenDisplayed: true,
      };
    case actions.CLOSE_SCORE_SCREEN:
      return {
        ...state,
        scoreScreenDisplayed: false,
      };
    case actions.SET_MATCHMAKING_WINDOW_VISIBLE:
      return {
        ...state,
        matchmakingScreen: {
          ...state.matchmakingScreen,
          isOpen: payload,
        },
      };
    case actions.SET_MATCHMAKING_DATA:
      return {
        ...state,
        matchmakingScreen: {
          ...state.matchmakingScreen,
          currentData: payload,
        },
      };
    default:
      return state;
  }
}
