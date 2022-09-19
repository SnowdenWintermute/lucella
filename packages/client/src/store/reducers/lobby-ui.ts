import { Action, ActionType } from "../actions/types";

export interface LobbyUIState {
  scoreScreenData: {};
  scoreScreenDisplayed: boolean;
}
const initialState: LobbyUIState = {
  scoreScreenData: {},
  scoreScreenDisplayed: false,
};

export default function (state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
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
    default:
      return state;
  }
}
