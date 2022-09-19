import { Alert } from "../../classes/Alert";
import { Action, ActionType } from "../actions/types";

const initialState: Alert[] = [];

export default function (state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case ActionType.SET_ALERT:
      if (state.find((item) => item.message === payload.message)) return [...state];
      return [...state, payload];
    case ActionType.REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
