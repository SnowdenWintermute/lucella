import {
  VIEW_GAMES_LIST_CLICKED,
  CLOSE_PRE_GAME_SCREEN,
  OPEN_PRE_GAME_SCREEN,
  SET_CURRENT_GAME,
  CLOSE_GAME_LIST,
} from "../actions/types";

const initialState = {
  currentGame: null,
  gameList: {
    isOpen: false,
  },
  preGameScreen: {
    isOpen: false,
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case VIEW_GAMES_LIST_CLICKED:
      state.gameList.isOpen = true;
      return state;
    case CLOSE_GAME_LIST:
      state.gameList.isOpen = false;
      return state;
    case OPEN_PRE_GAME_SCREEN:
      state.preGameScreen.isOpen = true;
      return state;
    case CLOSE_PRE_GAME_SCREEN:
      state.preGameScreen.isOpen = false;
      return state;
    case SET_CURRENT_GAME:
      state.currentGame = payload;
      return state;
    default:
      return state;
  }
}
