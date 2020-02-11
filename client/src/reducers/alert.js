import { SET_ALERT, REMOVE_ALERT, ANIMATE_ALERT } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      if (state.find(item => item.msg === payload.msg)) return [...state];
      return [...state, payload];
    case ANIMATE_ALERT:
      state.forEach(alert => {
        if (alert.msg === payload.msg) {
          alert.animating = true;
        }
      });
      return [...state];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
