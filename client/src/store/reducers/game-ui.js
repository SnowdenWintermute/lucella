import cloneDeep from "lodash.clonedeep";
import {
  VIEW_GAMES_LIST_CLICKED,
  CLOSE_PRE_GAME_SCREEN,
  OPEN_PRE_GAME_SCREEN,
  SET_CURRENT_GAME,
  CLOSE_GAME_LIST,
  UPDATE_PLAYERS_READY,
  UPDATE_GAME_STATUS,
} from "../actions/types";

const initialState = {
  currentGame: null,
  gameList: {
    isOpen: false,
  },
  preGameScreen: {
    isOpen: false,
  },
  playersReady: {
    host: false,
    challenger: false,
  },
  gameStatus: "inLobby",
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case VIEW_GAMES_LIST_CLICKED:
      return {
        ...state,
        gameList: { isOpen: true },
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
      const updatedGame = cloneDeep(payload);
      return {
        ...state,
        currentGame: updatedGame,
      };
    case UPDATE_PLAYERS_READY:
      return {
        ...state,
        playersReady: { ...payload },
      };
    case UPDATE_GAME_STATUS:
      return {
        ...state,
        gameStatus: payload,
      };
    default:
      return state;
  }
}
