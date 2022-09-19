import { GameStatus, PlayerRole } from "@lucella/common/battleRoomGame/enums";
import { Action, ActionType } from "../actions/types";

export interface GameUIState {
  gameList: {
    games: {};
    isOpen: boolean;
  };
  preGameScreen: {
    isOpen: boolean;
  };
  matchmakingScreen: {
    isOpen: boolean;
    currentData: {};
  };
  currentGameName: string;
  playersInGame: {};
  playersReady: {
    host: boolean;
    challenger: boolean;
  };
  countdownNumber: null;
  gameStatus: GameStatus;
  playerRole: PlayerRole | null;
  winner: PlayerRole | null;
  scoreScreenData: {};
  scoreScreenDisplayed: boolean;
  isRanked: boolean | null;
}

const initialState: GameUIState = {
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

export default function (state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case ActionType.VIEW_GAMES_LIST_CLICKED:
      return {
        ...state,
        gameList: { isOpen: true },
      };
    case ActionType.UPDATE_GAMES_LIST:
      return {
        ...state,
        gameList: {
          ...state.gameList,
          games: payload,
        },
      };
    case ActionType.CLOSE_GAME_LIST:
      return {
        ...state,
        gameList: { isOpen: false },
      };
    case ActionType.OPEN_PRE_GAME_SCREEN:
      return {
        ...state,
        preGameScreen: { isOpen: true },
      };
    case ActionType.CLOSE_PRE_GAME_SCREEN:
      return {
        ...state,
        preGameScreen: { isOpen: false },
      };
    case ActionType.SET_CURRENT_GAME:
      return {
        ...state,
        currentGameName: payload?.gameName || null,
        playersInGame: payload?.players || null,
        playersReady: payload?.playersReady || null,
        countdownNumber: payload?.countdown || null,
        gameStatus: payload?.gameStatus || null,
        isRanked: payload?.isRanked || null,
      };
    case ActionType.UPDATE_PLAYERS:
      return {
        ...state,
        playersInGame: { ...payload },
      };

    case ActionType.UPDATE_PLAYERS_READY:
      return {
        ...state,
        playersReady: { ...payload },
      };
    case ActionType.UPDATE_GAME_COUNTDOWN:
      return {
        ...state,
        countdownNumber: payload,
      };
    case ActionType.UPDATE_GAME_STATUS:
      return {
        ...state,
        gameStatus: payload,
      };
    case ActionType.UPDATE_PLAYER_ROLE:
      return {
        ...state,
        playerRole: payload,
      };
    case ActionType.SET_GAME_WINNER:
      return {
        ...state,
        winner: payload,
      };
    case ActionType.CLEAR_GAME_UI:
      return initialState;
    case ActionType.SET_SCORE_SCREEN_DATA:
      return {
        ...state,
        scoreScreenData: { ...payload },
        scoreScreenDisplayed: true,
      };
    case ActionType.CLOSE_SCORE_SCREEN:
      return {
        ...state,
        scoreScreenDisplayed: false,
      };
    case ActionType.SET_MATCHMAKING_WINDOW_VISIBLE:
      return {
        ...state,
        matchmakingScreen: {
          ...state.matchmakingScreen,
          isOpen: payload,
        },
      };
    case ActionType.SET_MATCHMAKING_DATA:
      return {
        ...state,
        matchmakingScreen: {
          ...state.matchmakingScreen,
          currentData: payload,
        },
      };
    default:
      return { ...state };
  }
}
