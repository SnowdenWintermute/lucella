import { NEW_CHAT_MESSAGE } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case NEW_CHAT_MESSAGE:
      const { room, message } = payload;
      if (!state[room]) {
        state[room] = [message];
      } else {
        state[room] = [...state[room], message];
      }
      return state;
    default:
      return state;
  }
}
