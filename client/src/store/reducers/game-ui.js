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
  UPDATE_PLAYER_DESIGNATION,
  CLEAR_GAME_UI,
} from "../actions/types";

const initialState = {
  gameList: {
    games: {},
    isOpen: false,
  },
  preGameScreen: {
    isOpen: false,
  },
  currentGameName: "",
  playersInGame: {},
  playersReady: {
    host: false,
    challenger: false,
  },
  countdownNumber: null,
  gameStatus: "inLobby",
  playerDesignation: null,
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
        currentGameName: payload && payload.gameName,
        playersInGame: payload && payload.players,
        playersReady: payload && payload.playersReady,
        countdownNumber: payload && payload.countdown,
        gameStatus: payload && payload.gameStatus,
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
    case UPDATE_PLAYER_DESIGNATION:
      return {
        ...state,
        playerDesignation: payload,
      };
    case CLEAR_GAME_UI:
      return initialState;
    default:
      return state;
  }
}
