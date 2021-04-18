import {
  VIEW_GAMES_LIST_CLICKED,
  UPDATE_GAMES_LIST,
  CLOSE_PRE_GAME_SCREEN,
  OPEN_PRE_GAME_SCREEN,
  SET_CURRENT_GAME,
  CLOSE_GAME_LIST,
  UPDATE_PLAYERS,
  UPDATE_PLAYERS_READY,
  UPDATE_GAME_COUNTDOWN,
  UPDATE_GAME_STATUS,
  UPDATE_PLAYER_ROLE,
  CLEAR_GAME_UI,
  SET_GAME_WINNER,
  SET_SCORE_SCREEN_DATA,
  CLOSE_SCORE_SCREEN,
  SET_MATCHMAKING_DATA,
  SET_MATCHMAKING_WINDOW_VISIBLE,
} from "../actions/types";

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
  gameStatus: "inLobby",
  playerRole: null,
  winner: null,
  scoreScreenData: {},
  scoreScreenDisplayed: false,
  isRanked: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case VIEW_GAMES_LIST_CLICKED:
      return {
        ...state,
        gameList: { isOpen: true },
      };
    case UPDATE_GAMES_LIST:
      return {
        ...state,
        gameList: {
          ...state.gameList,
          games: payload,
        },
      };
    case CLOSE_GAME_LIST:
      return {
        ...state,
        gameList: { isOpen: false },
      };
    case OPEN_PRE_GAME_SCREEN:
      return {
        ...state,
        preGameScreen: { isOpen: true },
      };
    case CLOSE_PRE_GAME_SCREEN:
      return {
        ...state,
        preGameScreen: { isOpen: false },
      };
    case SET_CURRENT_GAME:
      return {
        ...state,
        currentGameName: payload?.gameName || null,
        playersInGame: payload?.players || null,
        playersReady: payload?.playersReady || null,
        countdownNumber: payload?.countdown || null,
        gameStatus: payload?.gameStatus || null,
        isRanked: payload?.isRanked || null,
      };
    case UPDATE_PLAYERS:
      return {
        ...state,
        playersInGame: { ...payload },
      };

    case UPDATE_PLAYERS_READY:
      return {
        ...state,
        playersReady: { ...payload },
      };
    case UPDATE_GAME_COUNTDOWN:
      return {
        ...state,
        countdownNumber: payload,
      };
    case UPDATE_GAME_STATUS:
      return {
        ...state,
        gameStatus: payload,
      };
    case UPDATE_PLAYER_ROLE:
      return {
        ...state,
        playerRole: payload,
      };
    case SET_GAME_WINNER:
      return {
        ...state,
        winner: payload,
      };
    case CLEAR_GAME_UI:
      return initialState;
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
    case SET_MATCHMAKING_WINDOW_VISIBLE:
      return {
        ...state,
        matchmakingScreen: {
          ...state.matchmakingScreen,
          isOpen: payload,
        },
      };
    case SET_MATCHMAKING_DATA:
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
