import {
  VIEW_GAMES_LIST_CLICKED,
  CANCEL_GAME_SETUP_CLICKED,
  SETUP_NEW_GAME_CLICKED,
  SET_CURRENT_GAME,
  CANCEL_VIEW_GAMES_LIST_CLICKED,
} from "../actions/types";

const initialState = {
  currentGame: null,
  gameList: {
    isOpen: false,
  },
  gameSetupScreen: {
    isOpen: false,
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case VIEW_GAMES_LIST_CLICKED:
      state.gameList.isOpen = true;
      return state;
    case CANCEL_VIEW_GAMES_LIST_CLICKED:
      state.gameList.isOpen = false;
      return state;
    case SETUP_NEW_GAME_CLICKED:
      state.gameSetupScreen.isOpen = true;
      return state;
    case CANCEL_GAME_SETUP_CLICKED:
      state.gameSetupScreen.isOpen = false;
      return state;
    case SET_CURRENT_GAME:
      state.currentGame = payload;
      return state;
    default:
      return state;
  }
}
